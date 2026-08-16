"""
Script para generar el archivo SQL limpio y estructurado para importar directamente a Supabase/PostgreSQL.
Genera 5,000 encuestas clínicas completas, normalizadas y clínicamente correlacionadas con sus respectivas
escalas (PHQ-9, C-SSRS, BHS, Rosenberg, DASS-21), factores socioemocionales, notificaciones y usuarios.
"""

import random
import numpy as np
from datetime import datetime, timedelta

def esc(val):
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "TRUE" if val else "FALSE"
    if isinstance(val, (int, float)):
        return str(val)
    # String
    safe_str = str(val).replace("'", "''")
    return f"'{safe_str}'"

def generar_sql_supabase(n_encuestas=5000, seed=123):
    random.seed(seed)
    np.random.seed(seed)
    
    fecha_inicio = datetime(2025, 9, 1)
    
    # 1. Header y Creación / Verificación de Tablas
    sql_lines = []
    sql_lines.append("-- ============================================================================")
    sql_lines.append("-- SISTEMA IA DE SALUD MENTAL - DATASET LIMPIO PARA SUPABASE (POSTGRESQL)")
    sql_lines.append(f"-- Generado el: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_lines.append(f"-- Total de Registros Clínicos: {n_encuestas}")
    sql_lines.append("-- ============================================================================\n")
    
    sql_lines.append("BEGIN;\n")
    
    # Usuarios base
    sql_lines.append("-- 1. USUARIOS ADMINISTRADORES Y PSICÓLOGOS")
    sql_lines.append("INSERT INTO usuarios (id, alias, password, tipo, created_at) VALUES")
    sql_lines.append("  (1, 'admin', 'admin123', 'admin', NOW()),")
    sql_lines.append("  (2, 'dr_mendoza', 'psico2026', 'admin', NOW()),")
    sql_lines.append("  (3, 'dra_vargas', 'psico2026', 'admin', NOW()),")
    sql_lines.append("  (4, 'usuario_demo', 'user123', 'usuario', NOW())")
    sql_lines.append("ON CONFLICT (id) DO NOTHING;\n")
    
    # Categorías de Casos
    sql_lines.append("-- 2. CATEGORÍAS DE CASOS CLÍNICOS")
    sql_lines.append("INSERT INTO categorias_casos (id, nombre, descripcion, color, icono, created_at) VALUES")
    sql_lines.append("  (1, 'Intervención Prioritaria', 'Pacientes con ideación suicida activa o riesgo crítico', '#EF4444', 'alert-triangle', NOW()),")
    sql_lines.append("  (2, 'Seguimiento Semanal', 'Pacientes con depresión moderada o moderadamente severa', '#F59E0B', 'clock', NOW()),")
    sql_lines.append("  (3, 'Monitoreo Preventivo', 'Pacientes con factores psicosociales leves en observación', '#10B981', 'shield', NOW()),")
    sql_lines.append("  (4, 'Caso Cerrado / Estable', 'Casos resueltos con éxito y red de apoyo sólida', '#6B7280', 'check-circle', NOW())")
    sql_lines.append("ON CONFLICT (id) DO NOTHING;\n")
    
    # Listas de datos realistas
    nombres_f = ["María", "Lucía", "Camila", "Valentina", "Sofía", "Daniela", "Gabriela", "Andrea", "Paula", "Elena", "Valeria", "Mariana", "Natalia"]
    nombres_m = ["Carlos", "Mateo", "Sebastián", "Alejandro", "David", "Gabriel", "Diego", "Nicolás", "Javier", "Andrés", "Felipe", "Lucas", "Rodrigo"]
    apellidos = ["Gómez", "Rodríguez", "Mendoza", "Vargas", "Torres", "Castro", "Ríos", "Silva", "Navarro", "Morales", "Ortega", "Guerrero", "Rojas", "Paredes", "Salazar", "Flores"]
    
    ocupaciones = ["Estudiante", "Docente", "Ingeniero", "Comerciante", "Médico", "Enfermero", "Abogado", "Desempleado", "Empleado Administrativo", "Diseñador", "Psicólogo", "Contador", "Técnico", "Independiente"]
    estados_civiles = ["soltero", "casado", "divorciado", "union_libre", "viudo"]
    niveles_educ = ["primaria", "secundaria", "tecnico", "universitario", "posgrado"]
    ingresos = ["menos_1_smlv", "1_2_smlv", "2_4_smlv", "4_8_smlv", "mas_8_smlv"]
    
    sql_lines.append("-- 3. INSERCIÓN MASIVA DE ENCUESTAS Y ESCALAS CLÍNICAS\n")
    
    # Buffers para inserts en bloque (para máxima velocidad en Supabase)
    encuestas_rows = []
    phq9_rows = []
    cssrs_rows = []
    bhs_rows = []
    rosenberg_rows = []
    dass21_rows = []
    socio_rows = []
    salud_rows = []
    psico_rows = []
    historial_rows = []
    notif_rows = []
    
    for i in range(1, n_encuestas + 1):
        sexo = np.random.choice(["femenino", "masculino", "no_binario"], p=[0.53, 0.44, 0.03])
        nombre = random.choice(nombres_f if sexo == "femenino" else nombres_m)
        apellido = random.choice(apellidos)
        
        # Anonimato: 40% anónimas
        es_anonimo = random.random() < 0.40
        nombre_val = None if es_anonimo else nombre
        apellido_val = None if es_anonimo else apellido
        
        dias_offset = random.randint(0, 340)
        minutos_offset = random.randint(0, 1439)
        fecha_creacion = (fecha_inicio + timedelta(days=dias_offset, minutes=minutos_offset)).strftime("%Y-%m-%d %H:%M:%S")
        
        edad = int(np.random.normal(25, 9))
        edad = max(14, min(80, edad))
        
        estado_civil = random.choice(estados_civiles)
        nivel_educativo = random.choice(niveles_educ)
        ocupacion = random.choice(ocupaciones)
        ingreso_mensual = random.choice(ingresos)
        zona = np.random.choice(["urbana", "rural"], p=[0.84, 0.16])
        satisfaccion = random.randint(3, 5) if random.random() < 0.7 else None
        
        # Perfil latente
        perfil = np.random.choice(["bajo", "moderado", "alto", "muy_alto"], p=[0.60, 0.22, 0.12, 0.06])
        
        # 1. Encuesta
        encuestas_rows.append(
            f"({i}, NULL, {esc(nombre_val)}, {esc(apellido_val)}, '{fecha_creacion}', {edad}, '{sexo}', '{estado_civil}', '{nivel_educativo}', '{ocupacion}', '{ingreso_mensual}', '{zona}', 'vivo', NULL, NULL, NULL, '{fecha_creacion}', {esc(satisfaccion)})"
        )
        
        # 2. PHQ-9
        if perfil == "bajo":
            p_items = [np.random.choice([0, 1], p=[0.85, 0.15]) for _ in range(8)] + [0]
        elif perfil == "moderado":
            p_items = [np.random.choice([0, 1, 2], p=[0.25, 0.55, 0.20]) for _ in range(8)] + [np.random.choice([0, 1], p=[0.85, 0.15])]
        elif perfil == "alto":
            p_items = [np.random.choice([1, 2, 3], p=[0.20, 0.50, 0.30]) for _ in range(8)] + [np.random.choice([1, 2], p=[0.60, 0.40])]
        else:
            p_items = [np.random.choice([2, 3], p=[0.30, 0.70]) for _ in range(8)] + [np.random.choice([2, 3], p=[0.30, 0.70])]
        
        phq9_tot = sum(p_items)
        if phq9_tot <= 4: phq9_grav = "minimo"
        elif phq9_tot <= 9: phq9_grav = "leve"
        elif phq9_tot <= 14: phq9_grav = "moderado"
        elif phq9_tot <= 19: phq9_grav = "moderadamente_severo"
        else: phq9_grav = "severo"
        
        phq9_rows.append(
            f"({i}, {i}, {p_items[0]}, {p_items[1]}, {p_items[2]}, {p_items[3]}, {p_items[4]}, {p_items[5]}, {p_items[6]}, {p_items[7]}, {p_items[8]}, 1, {phq9_tot}, '{phq9_grav}')"
        )
        
        # 3. C-SSRS
        if perfil == "bajo":
            deseos = False; pens = False; met = False; int_s = False; plan = False; int_ej = False; intento_p = False; cssrs_sev = "ninguna"
        elif perfil == "moderado":
            deseos = random.random() < 0.35; pens = deseos; met = False; int_s = False; plan = False; int_ej = False; intento_p = False
            cssrs_sev = "ideacion" if deseos else "ninguna"
        elif perfil == "alto":
            deseos = True; pens = True; met = random.random() < 0.6; int_s = met; plan = False; int_ej = False
            intento_p = random.random() < 0.3
            cssrs_sev = "intento_no_letal" if met else "ideacion"
        else:
            deseos = True; pens = True; met = True; int_s = True; plan = random.random() < 0.6; int_ej = plan; intento_p = True
            cssrs_sev = "intento_letal" if int_ej else ("planificacion" if plan else "intento_no_letal")
            
        cssrs_rows.append(
            f"({i}, {i}, {esc(deseos)}, {esc(pens)}, {esc(met)}, {esc(int_s)}, {esc(plan)}, {esc(int_ej)}, {esc(intento_p)}, NULL, NULL, '{cssrs_sev}')"
        )
        
        # 4. BHS
        if perfil == "bajo": n_true = random.randint(0, 4); bhs_riesgo = "bajo"
        elif perfil == "moderado": n_true = random.randint(5, 9); bhs_riesgo = "moderado"
        elif perfil == "alto": n_true = random.randint(10, 14); bhs_riesgo = "alto"
        else: n_true = random.randint(15, 20); bhs_riesgo = "alto"
        
        bhs_bools = [True]*n_true + [False]*(20 - n_true)
        random.shuffle(bhs_bools)
        bhs_items_str = ", ".join("TRUE" if b else "FALSE" for b in bhs_bools)
        bhs_rows.append(f"({i}, {i}, {bhs_items_str}, {n_true}, '{bhs_riesgo}')")
        
        # 5. Rosenberg (10 items 1-4)
        if perfil == "bajo": r_items = [random.randint(3, 4) for _ in range(10)]
        elif perfil == "moderado": r_items = [random.randint(2, 3) for _ in range(10)]
        else: r_items = [random.randint(1, 2) for _ in range(10)]
        r_str = ", ".join(str(v) for v in r_items)
        rosenberg_rows.append(f"({i}, {i}, {r_str})")
        
        # 6. DASS-21 (21 items 0-3)
        if perfil == "bajo": d_items = [random.randint(0, 1) for _ in range(21)]
        elif perfil == "moderado": d_items = [random.randint(1, 2) for _ in range(21)]
        else: d_items = [random.randint(2, 3) for _ in range(21)]
        
        d_estres = sum(d_items[x] for x in [0, 5, 7, 10, 11, 13, 17]) * 2
        d_ansiedad = sum(d_items[x] for x in [1, 3, 6, 8, 14, 18, 19]) * 2
        d_depresion = sum(d_items[x] for x in [2, 4, 9, 12, 15, 16, 20]) * 2
        d_str = ", ".join(str(v) for v in d_items)
        dass21_rows.append(f"({i}, {i}, {d_str}, {d_estres}, {d_ansiedad}, {d_depresion})")
        
        # 7. Socioeconómicos
        socio_rows.append(
            f"({i}, {i}, '{ocupacion}', {random.randint(2, 5)}, 40, {random.randint(1, 4)}, '{random.choice(['sin_deudas', 'bajo', 'medio', 'alto'])}', {esc(perfil in ['alto', 'muy_alto'])}, {random.randint(1, 5)}, {random.randint(1, 5)}, {random.randint(1, 5)}, {random.randint(0, 5)}, {esc(random.random() < 0.25)}, 'propia', 4, TRUE, 'contributivo', 'cerca')"
        )
        
        # 8. Salud Física
        consume_d = perfil in ["alto", "muy_alto"] and random.random() < 0.35
        frec_alc = "frecuente" if (perfil in ["alto", "muy_alto"] and random.random() < 0.4) else "ocasional"
        salud_rows.append(
            f"({i}, {i}, {esc(random.random() < 0.15)}, NULL, {esc(random.random() < 0.1)}, {esc(random.random() < 0.12)}, NULL, {random.randint(1, 4)}, {round(random.uniform(4.5, 8.0), 1)}, {esc(perfil != 'bajo')}, TRUE, '{frec_alc}', FALSE, 'nunca', {esc(consume_d)}, NULL, 'ocasional')"
        )
        
        # 9. Psicológicos
        tiene_red = perfil != "muy_alto"
        psico_rows.append(
            f"({i}, {i}, 4, 3, 2, 2, 2, {esc(perfil in ['alto', 'muy_alto'] and random.random() < 0.5)}, {esc(perfil == 'muy_alto' and random.random() < 0.3)}, {esc(perfil in ['alto', 'muy_alto'] and random.random() < 0.4)}, FALSE, FALSE, FALSE, FALSE, FALSE, {esc(tiene_red)}, TRUE, {esc(perfil in ['alto', 'muy_alto'])}, NULL)"
        )
        
        # 10. Historial Intentos
        n_intentos = random.randint(1, 3) if perfil == "muy_alto" else 0
        historial_rows.append(
            f"({i}, {i}, {n_intentos}, NULL, NULL, NULL, {esc(n_intentos > 0)}, {esc(n_intentos > 0)}, {esc(perfil == 'muy_alto')}, FALSE)"
        )
        
        # 11. Notificaciones
        if perfil in ["moderado", "alto", "muy_alto"]:
            sla_h = 2 if perfil == "muy_alto" else (12 if perfil == "alto" else 24)
            nombre_mostrar = f"{nombre_val} {apellido_val}".strip() if nombre_val else f"Paciente #{i}"
            tit = f"Alerta {perfil.upper()}: {nombre_mostrar} ({edad} años, {sexo})"
            desc = f"Evaluación con PHQ-9: {phq9_tot}/27, C-SSRS: {cssrs_sev}, BHS: {n_true}/20. SLA de respuesta: {sla_h} horas."
            acc = "Contacto de emergencia y protocolo clínico inmediato." if perfil == "muy_alto" else "Evaluación prioritaria en consulta."
            leida = random.random() < 0.65
            notif_rows.append(
                f"({len(notif_rows)+1}, {i}, '{perfil}', {esc(tit)}, {esc(desc)}, {esc(leida)}, {esc(acc)}, NULL, '{fecha_creacion}', NULL, NULL)"
            )
            
    # Función helper para insertar en bloques de 500
    def agregar_bloques(tabla, columnas, filas):
        chunk_size = 300
        for start in range(0, len(filas), chunk_size):
            chunk = filas[start:start+chunk_size]
            sql_lines.append(f"INSERT INTO {tabla} ({columnas}) VALUES")
            sql_lines.append(",\n".join(chunk))
            sql_lines.append("ON CONFLICT (id) DO NOTHING;\n")

    print("[1] Ensamblando sentencias SQL...")
    agregar_bloques("encuestas", "id, usuario_id, nombre, apellido, fecha_creacion, edad, sexo, estado_civil, nivel_educativo, ocupacion, ingreso_mensual, zona_residencia, estado_usuario, causa_fallecimiento, fallecimiento_voluntario, fecha_fallecimiento, created_at, satisfaccion", encuestas_rows)
    agregar_bloques("phq9_respuestas", "id, encuesta_id, interes_actividades, estado_animo, sueno, energia, apetito, autoestima, concentracion, psicomotricidad, ideacion_suicida, dificultad_funcionamiento, puntaje_total, nivel_gravedad", phq9_rows)
    agregar_bloques("cssrs_respuestas", "id, encuesta_id, deseos_morir, pensamientos_suicidas, metodo_sin_plan, intencion_sin_plan, plan_especifico, intencion_ejecutar, intento_previo, fecha_ultimo_intento, metodo_intento, nivel_severidad", cssrs_rows)
    
    bhs_cols = "id, encuesta_id, " + ", ".join(f"item_{k}" for k in range(1, 21)) + ", puntaje_total, nivel_riesgo"
    agregar_bloques("bhs_respuestas", bhs_cols, bhs_rows)
    
    ros_cols = "id, encuesta_id, " + ", ".join(f"item{k}" for k in range(1, 11))
    agregar_bloques("rosenberg_respuestas", ros_cols, rosenberg_rows)
    
    dass_cols = "id, encuesta_id, " + ", ".join(f"item_{k}" for k in range(1, 22)) + ", puntaje_estres, puntaje_ansiedad, puntaje_depresion"
    agregar_bloques("dass21_respuestas", dass_cols, dass21_rows)
    
    agregar_bloques("factores_socioeconomicos", "id, encuesta_id, estado_laboral, satisfaccion_laboral, horas_trabajo_semanal, estres_laboral, nivel_deudas, dificultad_economica, calidad_relaciones_familiares, calidad_relaciones_pareja, apoyo_social_percibido, num_personas_confianza, vive_solo, tipo_vivienda, calidad_vivienda, acceso_salud_mental, tipo_afiliacion_salud, distancia_servicio_salud", socio_rows)
    agregar_bloques("salud_fisica", "id, encuesta_id, enfermedad_cronica, tipo_enfermedad_cronica, dolor_cronico, tratamiento_medico_actual, medicamentos_actuales, calidad_sueno, horas_sueno_promedio, insomnio, consume_alcohol, frecuencia_alcohol, consume_tabaco, frecuencia_tabaco, consume_drogas, tipo_drogas, frecuencia_drogas", salud_rows)
    agregar_bloques("factores_psicologicos", "id, encuesta_id, erq_reevaluacion_cognitiva, erq_supresion_expresiva, impulsividad_motora, impulsividad_no_planificada, impulsividad_atencional, perdida_familiar_reciente, violencia_fisica, violencia_psicologica, abuso_sexual, bullying, desempleo_reciente, rupture_pareja_reciente, problema_legal_reciente, tiene_red_apoyo, percibe_vida_con_sentido, ha_buscado_ayuda_profesional, tipo_ayuda_profesional", psico_rows)
    agregar_bloques("historial_intentos", "id, encuesta_id, num_intentos_previos, primer_intento_edad, ultimo_intento_fecha, metodo_intento, hospitalizacion_por_intento, tratamiento_psiquiatrico_previo, antecedentes_familiares_suicidio, antecedentes_familiares_enfermedad_mental", historial_rows)
    agregar_bloques("notificaciones", "id, encuesta_id, tipo_riesgo, titulo, descripcion, leida, accion_requerida, respuesta, fecha_creacion, fecha_lectura, fecha_respuesta", notif_rows)

    # Actualización de secuencias de Postgres
    sql_lines.append("-- 4. REINICIO DE SECUENCIAS DE AUTOINCREMENT")
    sql_lines.append(f"SELECT setval('encuestas_id_seq', (SELECT MAX(id) FROM encuestas));")
    sql_lines.append(f"SELECT setval('phq9_respuestas_id_seq', (SELECT MAX(id) FROM phq9_respuestas));")
    sql_lines.append(f"SELECT setval('cssrs_respuestas_id_seq', (SELECT MAX(id) FROM cssrs_respuestas));")
    sql_lines.append(f"SELECT setval('bhs_respuestas_id_seq', (SELECT MAX(id) FROM bhs_respuestas));")
    sql_lines.append(f"SELECT setval('rosenberg_respuestas_id_seq', (SELECT MAX(id) FROM rosenberg_respuestas));")
    sql_lines.append(f"SELECT setval('dass21_respuestas_id_seq', (SELECT MAX(id) FROM dass21_respuestas));")
    sql_lines.append(f"SELECT setval('factores_socioeconomicos_id_seq', (SELECT MAX(id) FROM factores_socioeconomicos));")
    sql_lines.append(f"SELECT setval('salud_fisica_id_seq', (SELECT MAX(id) FROM salud_fisica));")
    sql_lines.append(f"SELECT setval('factores_psicologicos_id_seq', (SELECT MAX(id) FROM factores_psicologicos));")
    sql_lines.append(f"SELECT setval('historial_intentos_id_seq', (SELECT MAX(id) FROM historial_intentos));")
    sql_lines.append(f"SELECT setval('notificaciones_id_seq', (SELECT MAX(id) FROM notificaciones));")
    sql_lines.append(f"SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));\n")
    
    sql_lines.append("COMMIT;\n")
    
    return "\n".join(sql_lines)

if __name__ == "__main__":
    sql_content = generar_sql_supabase(n_encuestas=5000)
    output_file = "database/supabase_data_limpia.sql"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(sql_content)
    print(f"[OK] Archivo SQL para Supabase generado exitosamente en: {output_file}")
