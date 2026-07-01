#!/usr/bin/env python3
"""Convert MySQL/MariaDB SQL dump to PostgreSQL compatible SQL."""

import re
import sys

# Tables where tinyint(1) columns are actually booleans
BOOLEAN_TABLES = {
    'bhs_respuestas': [
        'item_1', 'item_2', 'item_3', 'item_4', 'item_5',
        'item_6', 'item_7', 'item_8', 'item_9', 'item_10',
        'item_11', 'item_12', 'item_13', 'item_14', 'item_15',
        'item_16', 'item_17', 'item_18', 'item_19', 'item_20',
    ],
    'cssrs_respuestas': [
        'deseos_morir', 'pensamientos_suicidas', 'metodo_sin_plan',
        'intencion_sin_plan', 'plan_especifico', 'intencion_ejecutar',
        'intento_previo',
    ],
    'encuestas': ['fallecimiento_voluntario'],
    'factores_psicologicos': [
        'perdida_familiar_reciente', 'violencia_fisica', 'violencia_psicologica',
        'abuso_sexual', 'bullying', 'desempleo_reciente', 'rupture_pareja_reciente',
        'problema_legal_reciente', 'tiene_red_apoyo', 'percibe_vida_con_sentido',
        'ha_buscado_ayuda_profesional',
    ],
    'factores_socioeconomicos': [
        'dificultad_economica', 'vive_solo', 'acceso_salud_mental',
    ],
    'historial_intentos': [
        'hospitalizacion_por_intento', 'tratamiento_psiquiatrico_previo',
        'antecedentes_familiares_suicidio', 'antecedentes_familiares_enfermedad_mental',
    ],
    'notificaciones': ['leida'],
    'salud_fisica': [
        'enfermedad_cronica', 'dolor_cronico', 'tratamiento_medico_actual',
        'insomnio', 'consume_alcohol', 'consume_tabaco', 'consume_drogas',
    ],
}

# JSON columns (longtext with json_valid check -> JSONB)
JSON_COLUMNS = {
    'analisis_ia': ['resultado_analisis', 'recomendaciones'],
    'chat_mensajes': ['contexto_datos'],
}


def convert_column_def(col_def, table_name, auto_inc_tables=None):
    """Convert a single MySQL column definition to PostgreSQL."""
    col_def = col_def.strip()

    # Extract column name
    col_match = re.match(r'`(\w+)`\s+(.*)', col_def)
    if not col_match:
        return col_def

    col_name = col_match.group(1)
    rest = col_match.group(2)

    if auto_inc_tables is None:
        auto_inc_tables = set()

    # Check if this is the PK with AUTO_INCREMENT
    is_pk = 'AUTO_INCREMENT' in rest or (col_name == 'id' and table_name in auto_inc_tables)

    # Remove backticks from column name
    col_name_pg = f'"{col_name}"'

    # Convert types
    if is_pk:
        # Try to match with AUTO_INCREMENT first, then without
        if re.search(r'int\(11\)\s+NOT\s+NULL\s+AUTO_INCREMENT', rest):
            rest = re.sub(r'int\(11\)\s+NOT\s+NULL\s+AUTO_INCREMENT', 'SERIAL', rest)
        elif re.search(r'int\(11\)\s+NOT\s+NULL', rest):
            rest = re.sub(r'int\(11\)\s+NOT\s+NULL', 'SERIAL', rest)
        else:
            rest = re.sub(r'int\(11\)', 'SERIAL', rest)
    else:
        rest = re.sub(r'int\(11\)', 'INTEGER', rest)

    # Convert boolean columns
    if table_name in BOOLEAN_TABLES and col_name in BOOLEAN_TABLES[table_name]:
        rest = re.sub(r'tinyint\(1\)', 'BOOLEAN', rest)
        rest = re.sub(r'DEFAULT\s+0\b', 'DEFAULT false', rest)
        rest = re.sub(r'DEFAULT\s+1\b', 'DEFAULT true', rest)
    else:
        rest = re.sub(r'tinyint\(1\)', 'SMALLINT', rest)

    # Convert JSON columns
    if table_name in JSON_COLUMNS and col_name in JSON_COLUMNS[table_name]:
        rest = re.sub(r'longtext.*', 'JSONB', rest)
    else:
        rest = re.sub(r'longtext\b', 'TEXT', rest)

    # Convert datetime
    rest = re.sub(r'datetime\(3\)', 'TIMESTAMP(3)', rest)
    rest = re.sub(r'current_timestamp\(3\)', 'CURRENT_TIMESTAMP', rest)

    # Convert double
    rest = re.sub(r'\bdouble\b', 'DOUBLE PRECISION', rest)

    # Remove CHARACTER SET and COLLATE
    rest = re.sub(r"\s*CHARACTER\s+SET\s+\w+\s+COLLATE\s+\w+", '', rest)
    rest = re.sub(r"\s*CHARACTER\s+SET\s+\w+", '', rest)
    rest = re.sub(r"\s*COLLATE\s+\w+", '', rest)

    # Remove CHECK (json_valid(...))
    rest = re.sub(r"\s*CHECK\s+\(json_valid\([^)]+\)\)", '', rest)

    return f'{col_name_pg} {rest}'


def convert_create_table(match, auto_inc_tables=None):
    """Convert a MySQL CREATE TABLE to PostgreSQL."""
    table_name = match.group(1)
    body = match.group(2)
    if auto_inc_tables is None:
        auto_inc_tables = set()

    # Split by commas, but not commas inside parentheses
    parts = []
    current = ''
    depth = 0
    for ch in body:
        if ch == '(':
            depth += 1
            current += ch
        elif ch == ')':
            depth -= 1
            current += ch
        elif ch == ',' and depth == 0:
            parts.append(current.strip())
            current = ''
        else:
            current += ch
    if current.strip():
        parts.append(current.strip())

    # Process each part
    new_parts = []
    for part in parts:
        part = part.strip()
        if not part:
            continue

        # Skip PRIMARY KEY constraint line
        if re.match(r'PRIMARY\s+KEY', part):
            continue

        # Skip INDEX/KEY lines
        if re.match(r'(UNIQUE\s+)?(INDEX|KEY)', part):
            continue

        # Convert column definition
        converted = convert_column_def(part, table_name, auto_inc_tables)
        new_parts.append(f'    {converted}')

    body_formatted = ',\n'.join(new_parts)
    return f'CREATE TABLE "{table_name}" (\n{body_formatted}\n);'


def convert_insert(match):
    """Convert a MySQL INSERT statement to PostgreSQL."""
    full = match.group(0)

    # Remove backticks
    full = full.replace('`', '"')

    # Find the table name
    table_match = re.search(r'INTO\s+"(\w+)"', full)
    if not table_match:
        return full

    table_name = table_match.group(1)

    # For tables with boolean columns, convert 0/1 to false/true
    if table_name in BOOLEAN_TABLES:
        bool_cols = BOOLEAN_TABLES[table_name]

        # Extract column names from the column list
        cols_match = re.search(r'\(([^)]+)\)\s*VALUES', full)
        if cols_match:
            col_names = [c.strip().strip('"') for c in cols_match.group(1).split(',')]

            # Find which positions are boolean
            bool_positions = set()
            for i, col in enumerate(col_names):
                if col in bool_cols:
                    bool_positions.add(i)

            if bool_positions:
                # Process each VALUES tuple
                values_start = full.index('VALUES') + len('VALUES')
                values_part = full[values_start:]

                # Split into individual tuples - handle nested parens
                tuples = []
                current_tuple = ''
                paren_depth = 0
                in_string = False
                string_char = None

                for ch in values_part:
                    if in_string:
                        current_tuple += ch
                        if ch == string_char and (len(current_tuple) < 2 or current_tuple[-2] != '\\'):
                            in_string = False
                    else:
                        if ch in ("'", '"'):
                            in_string = True
                            string_char = ch
                            current_tuple += ch
                        elif ch == '(':
                            paren_depth += 1
                            current_tuple += ch
                        elif ch == ')':
                            paren_depth -= 1
                            current_tuple += ch
                            if paren_depth == 0:
                                tuples.append(current_tuple.strip())
                                current_tuple = ''
                        elif ch == ',' and paren_depth == 0:
                            # Skip commas between tuples
                            pass
                        else:
                            current_tuple += ch

                new_tuples = []
                for tuple_str in tuples:
                    # Remove outer parens
                    inner = tuple_str[1:-1]

                    # Parse values
                    values = parse_values(inner)

                    # Convert boolean positions
                    for pos in bool_positions:
                        if pos < len(values):
                            val = values[pos].strip()
                            if val == '0':
                                values[pos] = ' false'
                            elif val == '1':
                                values[pos] = ' true'

                    new_tuples.append('(' + ','.join(values) + ')')

                full = full[:values_start] + '\n' + ',\n'.join(new_tuples) + ';\n'

    return full


def parse_values(tuple_str):
    """Parse a VALUES tuple, handling quoted strings with commas."""
    values = []
    current = ''
    in_string = False
    string_char = None

    i = 0
    while i < len(tuple_str):
        ch = tuple_str[i]

        if in_string:
            if ch == string_char:
                if i + 1 < len(tuple_str) and tuple_str[i + 1] == string_char:
                    current += ch + ch
                    i += 1
                else:
                    in_string = False
                    current += ch
            else:
                current += ch
        else:
            if ch in ("'", '"'):
                in_string = True
                string_char = ch
                current += ch
            elif ch == ',':
                values.append(current)
                current = ''
            else:
                current += ch
        i += 1

    if current.strip():
        values.append(current)

    return values


def find_auto_increment_tables(content):
    """Find all tables that have AUTO_INCREMENT in ALTER TABLE statements."""
    tables = set()
    for match in re.finditer(r'ALTER\s+TABLE\s+`(\w+)`\s+MODIFY\s+`id`\s+int\(\d+\)\s+NOT\s+NULL\s+AUTO_INCREMENT', content):
        tables.add(match.group(1))
    return tables


def convert_dump(input_file, output_file):
    """Convert a MySQL dump to PostgreSQL."""
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all tables with AUTO_INCREMENT before removing ALTER TABLE
    auto_inc_tables = find_auto_increment_tables(content)
    print(f'Tables with AUTO_INCREMENT: {auto_inc_tables}')

    # Remove MySQL conditional comments
    content = re.sub(r'/\*!\d+\s+[^*]*\*/\s*;', '', content)

    # Remove SET statements
    content = re.sub(r'SET\s+SQL_MODE\s*=.*?;', '', content)
    content = re.sub(r'SET\s+time_zone\s*=.*?;', '', content)
    content = re.sub(r'START\s+TRANSACTION;', '', content)

    # Convert CREATE TABLE statements - pass auto_inc_tables
    def create_table_handler(match):
        return convert_create_table(match, auto_inc_tables)

    content = re.sub(
        r'CREATE TABLE `(\w+)`\s*\((.*?)\)\s*ENGINE=\w+[^;]*;',
        create_table_handler,
        content,
        flags=re.DOTALL
    )

    # Convert INSERT statements
    content = re.sub(
        r'INSERT INTO\s+`\w+`[^;]*;',
        convert_insert,
        content
    )

    # Remove ALTER TABLE statements (handled by SERIAL and separate index creation)
    content = re.sub(r'ALTER TABLE[^;]*;', '', content)

    # Remove COMMIT
    content = re.sub(r'COMMIT;', '', content)

    # Clean up multiple blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)

    # Build output
    header = """-- PostgreSQL dump converted from MySQL
-- Converted using convert_mysql_to_postgres.py

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

"""

    footer = """
-- Reset sequences to correct values
SELECT setval('encuestas_id_seq', (SELECT COALESCE(MAX(id), 1) FROM encuestas));
SELECT setval('usuarios_id_seq', (SELECT COALESCE(MAX(id), 1) FROM usuarios));
SELECT setval('phq9_respuestas_id_seq', (SELECT COALESCE(MAX(id), 1) FROM phq9_respuestas));
SELECT setval('cssrs_respuestas_id_seq', (SELECT COALESCE(MAX(id), 1) FROM cssrs_respuestas));
SELECT setval('bhs_respuestas_id_seq', (SELECT COALESCE(MAX(id), 1) FROM bhs_respuestas));
SELECT setval('rosenberg_respuestas_id_seq', (SELECT COALESCE(MAX(id), 1) FROM rosenberg_respuestas));
SELECT setval('dass21_respuestas_id_seq', (SELECT COALESCE(MAX(id), 1) FROM dass21_respuestas));
SELECT setval('factores_socioeconomicos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM factores_socioeconomicos));
SELECT setval('salud_fisica_id_seq', (SELECT COALESCE(MAX(id), 1) FROM salud_fisica));
SELECT setval('factores_psicologicos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM factores_psicologicos));
SELECT setval('historial_intentos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM historial_intentos));
SELECT setval('analisis_ia_id_seq', (SELECT COALESCE(MAX(id), 1) FROM analisis_ia));
SELECT setval('chat_sesiones_id_seq', (SELECT COALESCE(MAX(id), 1) FROM chat_sesiones));
SELECT setval('chat_mensajes_id_seq', (SELECT COALESCE(MAX(id), 1) FROM chat_mensajes));
SELECT setval('notificaciones_id_seq', (SELECT COALESCE(MAX(id), 1) FROM notificaciones));
"""

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(header)
        f.write(content)
        f.write(footer)

    print(f'Converted {input_file} -> {output_file}')


if __name__ == '__main__':
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'sistema_ia_depresion (1).sql'
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'sistema_ia_postgres.sql'
    convert_dump(input_file, output_file)
