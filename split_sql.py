#!/usr/bin/env python3
"""Split a large SQL file into smaller chunks for Supabase SQL Editor."""

import re
import sys
import os

def split_sql_file(input_file, max_size_mb=2):
    """Split SQL file into chunks smaller than max_size_mb."""
    max_size_bytes = max_size_mb * 1024 * 1024
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by CREATE TABLE and INSERT blocks
    # Find all CREATE TABLE statements
    create_tables = []
    insert_blocks = []
    
    # Extract header (everything before first CREATE TABLE)
    first_create = content.find('CREATE TABLE')
    if first_create == -1:
        print("No CREATE TABLE found!")
        return
    
    header = content[:first_create].strip()
    
    # Split the rest into blocks
    remaining = content[first_create:]
    
    # Find all CREATE TABLE statements
    parts = re.split(r'((?:CREATE TABLE\s+"?\w+"?\s*\([^;]+\);))', remaining)
    
    # Process parts
    i = 0
    current_inserts = []
    
    for part in parts:
        if part.strip().startswith('CREATE TABLE'):
            # If we have pending inserts, save them
            if current_inserts:
                insert_blocks.append('\n'.join(current_inserts))
                current_inserts = []
            create_tables.append(part.strip())
        elif part.strip().startswith('INSERT INTO'):
            # Split large INSERT statements by VALUES
            lines = part.strip().split('\n')
            current_inserts.append(lines[0])  # INSERT INTO ... VALUES
            
            # Split VALUES into chunks
            values_lines = lines[1:] if len(lines) > 1 else []
            chunk = []
            chunk_size = 0
            
            for line in values_lines:
                if chunk_size + len(line) > max_size_bytes and chunk:
                    insert_blocks.append('\n'.join(current_inserts + [',\n'.join(chunk)]))
                    current_inserts = []
                    chunk = []
                    chunk_size = 0
                chunk.append(line)
                chunk_size += len(line)
            
            if chunk:
                current_inserts.append(',\n'.join(chunk))
        elif part.strip().startswith('--') or part.strip() == '':
            # Comments or empty lines, skip
            pass
    
    # Don't forget remaining inserts
    if current_inserts:
        insert_blocks.append('\n'.join(current_inserts))
    
    # Create output files
    output_dir = os.path.dirname(input_file) or '.'
    base_name = os.path.splitext(os.path.basename(input_file))[0]
    
    # File 1: Schema (CREATE TABLE statements)
    schema_file = os.path.join(output_dir, f'{base_name}_01_schema.sql')
    with open(schema_file, 'w', encoding='utf-8') as f:
        f.write(header + '\n\n')
        f.write('\n\n'.join(create_tables) + '\n')
    print(f'Created: {schema_file} ({os.path.getsize(schema_file) / 1024:.0f} KB)')
    
    # Files 2+: INSERT blocks
    for idx, block in enumerate(insert_blocks):
        part_file = os.path.join(output_dir, f'{base_name}_02_data_{idx+1}.sql')
        with open(part_file, 'w', encoding='utf-8') as f:
            f.write(block + '\n')
        size_kb = os.path.getsize(part_file) / 1024
        print(f'Created: {part_file} ({size_kb:.0f} KB)')
    
    # Last file: sequences reset
    seq_file = os.path.join(output_dir, f'{base_name}_03_sequences.sql')
    with open(seq_file, 'w', encoding='utf-8') as f:
        f.write("""-- Reset sequences to correct values
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
""")
    print(f'Created: {seq_file}')
    
    print(f'\nTotal files created: {len(insert_blocks) + 2}')
    print('Import in order: 1) schema, 2) data files, 3) sequences')


if __name__ == '__main__':
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'sistema_ia_postgres.sql'
    max_size = float(sys.argv[2]) if len(sys.argv) > 2 else 2.0
    split_sql_file(input_file, max_size)
