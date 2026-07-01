"""
Genera datos masivos realistas para sistema_ia_depresion usando Faker + MySQL.
Usa providers de Faker para nombres, ciudades, ocupaciones, etc.
Incluye: usuario_id, nombre, apellido (opcionales) + notificaciones automáticas.
"""

import random
import sys
import hashlib
import mysql.connector
from faker import Faker
from datetime import datetime
import io
import os

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
os.environ['PYTHONIOENCODING'] = 'utf-8'

fake = Faker('es_ES')

DISTRITOS_LIMA = [
    'Lima', 'San Isidro', 'Miraflores', 'Surco', 'San Borja', 'Jesús María',
    'Pueblo Libre', 'Lince', 'Magdalena', 'San Miguel', 'Rímac', 'Ate',
    'Santa Anita', 'El Agustino', 'San Juan de Lurigancho', 'San Juan de Miraflores',
    'Villa María del Triunfo', 'Villa El Salvador', 'Chorrillos', 'Surquillo',
    'Barranco', 'Breña', 'La Victoria', 'San Martín de Porres', 'Comas',
    'Los Olivos', 'Independencia', 'Puente Piedra', 'Carabayllo', 'Lurín',
    'Pachacámac', 'Cieneguilla', 'San Bartolo', 'Ancón', 'Chaclacayo'
]

ENFERMEDADES_CRONICAS = [
    'Diabetes tipo 2', 'Hipertensión arterial', 'Asma', 'Artritis reumatoide',
    'Lupus', 'Epilepsia', 'Cardiopatía', 'Enfermedad renal crónica',
    'Hipotiroidismo', 'Colesterol alto', 'Enfermedad pulmonar', 'migraña crónica'
]

MEDICAMENTOS = [
    'Metformina', 'Losartán', 'Ibuprofeno', 'Paracetamol', 'Omeprazol',
    'Amoxicilina', 'Salbutamol', 'Levotiroxina', 'Atorvastatina', 'Amlodipino',
    'Sertralina', 'Fluoxetina', 'Escitalopram', 'Diazepam', 'Clonazepam',
    'Warfarina', 'Prednisona', 'Diclofenaco', 'Naproxeno', 'Tramadol'
]

METODOS_INTENTO = [
    'Intoxicación', 'Corte de venas', 'Ahoramiento',
    'Caída de altura', 'Arma de fuego', 'Ahogamiento'
]

NIVELES_PHQ9 = {
    'minimo': (0, 4), 'leve': (5, 9), 'moderado': (10, 14),
    'moderadamente_severo': (15, 19), 'severo': (20, 27)
}
NIVELES_BHS = {'bajo': (0, 9), 'moderado': (10, 14), 'alto': (15, 20)}
ESTRES_IDX = [0, 5, 7, 10, 11, 13, 17]
ANSIEDAD_IDX = [1, 3, 6, 8, 14, 18, 19]
DEPRESION_IDX = [2, 4, 9, 12, 15, 16, 20]


def weighted_choice(options_weights):
    options, weights = zip(*options_weights)
    return random.choices(options, weights=weights, k=1)[0]


def calcular_nivel(value, thresholds):
    for nivel, (lo, hi) in thresholds.items():
        if lo <= value <= hi:
            return nivel
    return list(thresholds.keys())[-1]


def calcular_dass21_subscale(items, indices):
    return sum(items[i] for i in indices) * 2


def calcular_riesgo_global(phq9, bhs, cssrs_nivel, ideacion_suicida, intento_previo, consume_sustancias, aislamiento):
    puntos = 0
    if phq9 >= 20: puntos += 4
    elif phq9 >= 15: puntos += 3
    elif phq9 >= 10: puntos += 2
    elif phq9 >= 5: puntos += 1

    if bhs >= 15: puntos += 4
    elif bhs >= 10: puntos += 3
    elif bhs >= 5: puntos += 1

    if cssrs_nivel == 'intento_letal': puntos += 5
    elif cssrs_nivel == 'planificacion': puntos += 4
    elif cssrs_nivel == 'intento_no_letal': puntos += 3

    if ideacion_suicida >= 2: puntos += 3
    elif ideacion_suicida >= 1: puntos += 1

    if intento_previo: puntos += 3
    if consume_sustancias: puntos += 2
    if aislamiento: puntos += 2

    if puntos >= 12: return 'muy_alto', puntos
    elif puntos >= 8: return 'alto', puntos
    elif puntos >= 4: return 'moderado', puntos
    return 'bajo', puntos


def generate_phq9_items(level):
    lo, hi = NIVELES_PHQ9[level]
    target = random.randint(lo, hi)
    items = [0] * 9
    remaining = target
    for i in range(9):
        if remaining <= 0:
            items[i] = 0
        elif remaining >= 3:
            items[i] = random.choice([2, 3])
            remaining -= items[i]
        else:
            items[i] = min(remaining, 3)
            remaining -= items[i]
    random.shuffle(items)
    return items


def generate_cssrs_data(level):
    data = {
        'deseos_morir': 0, 'pensamientos_suicidas': 0, 'metodo_sin_plan': 0,
        'intencion_sin_plan': 0, 'plan_especifico': 0, 'intencion_ejecutar': 0,
        'intento_previo': 0, 'metodo_intento': None, 'fecha_ultimo_intento': None
    }
    if level == 'sin_ideacion':
        return data, 'ideacion'

    data['deseos_morir'] = 1
    if level in ('ideacion', 'planificacion', 'intento_no_letal', 'intento_letal'):
        data['pensamientos_suicidas'] = 1
    if level in ('planificacion', 'intento_no_letal', 'intento_letal'):
        data['metodo_sin_plan'] = 1
        data['intencion_sin_plan'] = 1
    if level in ('planificacion', 'intento_letal'):
        data['plan_especifico'] = 1
    if level == 'intento_letal':
        data['intencion_ejecutar'] = 1

    if level in ('intento_no_letal', 'intento_letal'):
        data['intento_previo'] = 1
        data['metodo_intento'] = random.choice(METODOS_INTENTO)
        data['fecha_ultimo_intento'] = fake.date_between(
            start_date=datetime(2023, 1, 1), end_date=datetime.now()
        )

    severidad_map = {
        'sin_ideacion': 'ideacion', 'ideacion': 'ideacion',
        'planificacion': 'planificacion', 'intento_no_letal': 'intento_no_letal',
        'intento_letal': 'intento_letal'
    }
    return data, severidad_map[level]


def generate_bhs_items(level):
    lo, hi = NIVELES_BHS[level]
    target = random.randint(lo, hi)
    items = [False] * 20
    indices = list(range(20))
    random.shuffle(indices)
    for i in range(target):
        items[indices[i]] = True
    return items


def generate_rosenberg_items(level):
    if level == 'bajo':
        return [random.randint(1, 2) for _ in range(10)]
    elif level == 'medio':
        return [random.randint(2, 3) for _ in range(10)]
    else:
        return [random.randint(3, 4) for _ in range(10)]


def generate_dass21_items(level):
    ranges = {'normal': (0, 1), 'leve': (1, 2), 'moderado': (2, 3), 'severo': (2, 3), 'extremo': (3, 3)}
    lo, hi = ranges.get(level, (0, 1))
    return [random.randint(lo, hi) for _ in range(21)]


def get_db_connection():
    return mysql.connector.connect(
        host='localhost', port=3306, user='root', password='',
        database='sistema_ia_depresion', charset='utf8mb4'
    )


def get_existing_user_ids(cursor):
    cursor.execute("SELECT id FROM usuarios WHERE tipo = 'usuario'")
    return [row[0] for row in cursor.fetchall()]


def generate_profile(user_ids):
    sexo = weighted_choice([('masculino', 0.70), ('femenino', 0.28), ('no_binario', 0.02)])
    edad = weighted_choice([
        (random.randint(14, 17), 0.12), (random.randint(18, 25), 0.22),
        (random.randint(26, 35), 0.22), (random.randint(36, 45), 0.18),
        (random.randint(46, 65), 0.16), (random.randint(66, 85), 0.10)
    ])

    severity = weighted_choice([
        ('minimo', 0.20), ('leve', 0.22), ('moderado', 0.25),
        ('moderadamente_severo', 0.18), ('severo', 0.15)
    ])

    if severity == 'minimo':
        cssrs_level = weighted_choice([('sin_ideacion', 0.85), ('ideacion', 0.15)])
        bhs_level = weighted_choice([('bajo', 0.80), ('moderado', 0.15), ('alto', 0.05)])
        rosenberg_level, dass21_level = 'alto', 'normal'
    elif severity == 'leve':
        cssrs_level = weighted_choice([('sin_ideacion', 0.55), ('ideacion', 0.30), ('planificacion', 0.10), ('intento_no_letal', 0.05)])
        bhs_level = weighted_choice([('bajo', 0.55), ('moderado', 0.35), ('alto', 0.10)])
        rosenberg_level, dass21_level = 'medio', 'leve'
    elif severity == 'moderado':
        cssrs_level = weighted_choice([('sin_ideacion', 0.30), ('ideacion', 0.35), ('planificacion', 0.15), ('intento_no_letal', 0.15), ('intento_letal', 0.05)])
        bhs_level = weighted_choice([('bajo', 0.25), ('moderado', 0.50), ('alto', 0.25)])
        rosenberg_level, dass21_level = 'medio', 'moderado'
    elif severity == 'moderadamente_severo':
        cssrs_level = weighted_choice([('sin_ideacion', 0.10), ('ideacion', 0.25), ('planificacion', 0.25), ('intento_no_letal', 0.25), ('intento_letal', 0.15)])
        bhs_level = weighted_choice([('bajo', 0.10), ('moderado', 0.40), ('alto', 0.50)])
        rosenberg_level, dass21_level = 'bajo', 'severo'
    else:
        cssrs_level = weighted_choice([('sin_ideacion', 0.03), ('ideacion', 0.15), ('planificacion', 0.20), ('intento_no_letal', 0.30), ('intento_letal', 0.32)])
        bhs_level = weighted_choice([('bajo', 0.05), ('moderado', 0.25), ('alto', 0.70)])
        rosenberg_level, dass21_level = 'bajo', 'extremo'

    estado_usuario = 'vivo'
    causa_fallecimiento = None
    fallecimiento_voluntario = None
    fecha_fallecimiento = None
    if severity == 'severo' and cssrs_level == 'intento_letal' and random.random() < 0.40:
        estado_usuario = 'fallecido'
        causa_fallecimiento = random.choice(['Ahoramiento', 'Caída de altura', 'Intoxicación', 'Arma de fuego'])
        fallecimiento_voluntario = True
        fecha_fallecimiento = fake.date_between(start_date=datetime(2024, 1, 1), end_date=datetime.now())

    estado_civil = weighted_choice([
        ('soltero', 0.35 if edad < 25 else 0.20),
        ('casado', 0.15 if edad < 25 else 0.35),
        ('union_libre', 0.20), ('divorciado', 0.10),
        ('viudo', 0.05 if edad < 60 else 0.20), ('otro', 0.05)
    ])

    nivel_educativo = weighted_choice([
        ('secundaria', 0.25 if edad < 20 else 0.15), ('tecnico', 0.20),
        ('universitario', 0.30), ('posgrado', 0.05 if edad < 30 else 0.10),
        ('primaria', 0.10 if edad > 50 else 0.05)
    ])

    zona_residencia = weighted_choice([('urbana', 0.75), ('rural', 0.25)])

    if severity in ('severo', 'moderadamente_severo'):
        ingreso_mensual = weighted_choice([('menos_1_smlv', 0.35), ('1_2_smlv', 0.35), ('2_4_smlv', 0.20), ('4_8_smlv', 0.08), ('mas_8_smlv', 0.02)])
    else:
        ingreso_mensual = weighted_choice([('menos_1_smlv', 0.15), ('1_2_smlv', 0.25), ('2_4_smlv', 0.30), ('4_8_smlv', 0.20), ('mas_8_smlv', 0.10)])

    ocupacion = 'Estudiante' if edad < 18 else fake.job()
    if severity == 'severo' and random.random() < 0.3:
        ocupacion = 'Desempleado'

    enfermedad_cronica = edad >= 50 and random.random() < 0.4
    tipo_enfermedad = random.choice(ENFERMEDADES_CRONICAS) if enfermedad_cronica else None
    dolor_cronico = severity in ('severo', 'moderadamente_severo') and random.random() < 0.3
    tratamiento_medico = enfermedad_cronica
    medicamentos = random.choice(MEDICAMENTOS) if tratamiento_medico else None

    calidad_sueno = max(1, min(5, 5 - (NIVELES_PHQ9[severity][0] // 6)))
    horas_sueno = random.uniform(3, 5.5) if severity == 'severo' else random.uniform(5, 9)
    insomnio = calidad_sueno <= 2

    consume_alcohol = edad >= 18 and random.random() < 0.35
    frecuencia_alcohol = random.choice(['nunca', 'ocasional', 'moderado', 'frecuente', 'diario']) if consume_alcohol else 'nunca'
    consume_tabaco = edad >= 18 and random.random() < 0.15
    frecuencia_tabaco = random.choice(['nunca', 'ocasional', 'moderado', 'frecuente', 'diario']) if consume_tabaco else 'nunca'
    consume_drogas = edad >= 18 and severity == 'severo' and random.random() < 0.15
    tipo_drogas = random.choice(['Marihuana', 'Cocaína', 'Éxtasis', 'Anfetaminas']) if consume_drogas else None
    frecuencia_drogas = random.choice(['nunca', 'ocasional', 'moderado']) if consume_drogas else None

    erq_reevaluacion = random.randint(8, 26) if severity == 'severo' else random.randint(14, 26)
    erq_supresion = random.randint(18, 28) if severity == 'severo' else random.randint(8, 20)
    impulsividad_motora = random.randint(18, 30) if severity == 'severo' else random.randint(8, 18)
    impulsividad_no_planificada = random.randint(16, 28) if severity == 'severo' else random.randint(8, 18)
    impulsividad_atencional = random.randint(14, 24) if severity == 'severo' else random.randint(8, 16)

    tiene_red = severity not in ('severo', 'moderadamente_severo') or random.random() < 0.3
    percibe_sentido = severity not in ('severo', 'moderadamente_severo') or random.random() < 0.25
    ha_buscado_ayuda = severity in ('severo', 'moderadamente_severo') and random.random() < 0.4

    num_intentos = 0
    primer_intento_edad = None
    ultimo_intento_fecha = None
    metodo_intento_h = None
    hospitalizacion = False

    if cssrs_level in ('intento_no_letal', 'intento_letal'):
        num_intentos = random.randint(1, 4)
        primer_intento_edad = random.randint(max(14, edad - 10), max(14, edad - 1))
        ultimo_intento_fecha = fake.date_between(start_date=datetime(2023, 1, 1), end_date=datetime.now())
        metodo_intento_h = random.choice(METODOS_INTENTO)
        hospitalizacion = random.random() < 0.5

    fecha_encuesta = fake.date_between(start_date=datetime(2024, 1, 1), end_date=datetime(2026, 6, 28))

    # Nombre y apellido opcionales (algunos lo tienen, otros no)
    nombre = None
    apellido = None
    if random.random() < 0.6:
        nombre = fake.first_name()
        apellido = fake.last_name()

    # Vincular a usuario existente (30% de probabilidad)
    usuario_id = None
    if user_ids and random.random() < 0.3:
        usuario_id = random.choice(user_ids)

    return {
        'usuario_id': usuario_id,
        'nombre': nombre,
        'apellido': apellido,
        'edad': edad,
        'sexo': sexo,
        'estado_civil': estado_civil,
        'nivel_educativo': nivel_educativo,
        'ocupacion': ocupacion,
        'ingreso_mensual': ingreso_mensual,
        'zona_residencia': zona_residencia,
        'estado_usuario': estado_usuario,
        'causa_fallecimiento': causa_fallecimiento,
        'fallecimiento_voluntario': fallecimiento_voluntario,
        'fecha_fallecimiento': fecha_fallecimiento,
        'created_at': datetime.combine(fecha_encuesta, datetime.min.time()),
        'phq9_items': generate_phq9_items(severity),
        'cssrs_data': generate_cssrs_data(cssrs_level),
        'bhs_items': generate_bhs_items(bhs_level),
        'rosenberg_items': generate_rosenberg_items(rosenberg_level),
        'dass21_items': generate_dass21_items(dass21_level),
        'estado_laboral': ocupacion.lower().replace(' ', '_'),
        'satisfaccion_laboral': max(1, min(5, 5 - (NIVELES_PHQ9[severity][0] // 6))),
        'horas_trabajo_semanal': random.randint(35, 55) if 'empleado' in ocupacion.lower() else None,
        'estres_laboral': min(5, max(1, NIVELES_PHQ9[severity][0] // 5 + 1)),
        'nivel_deudas': weighted_choice([('sin_deudas', 0.25), ('bajo', 0.25), ('medio', 0.25), ('alto', 0.15), ('muy_alto', 0.10)]),
        'dificultad_economica': severity in ('severo', 'moderadamente_severo') and random.random() < 0.5,
        'calidad_relaciones_familiares': max(1, min(5, 5 - (NIVELES_PHQ9[severity][0] // 6))),
        'calidad_relaciones_pareja': max(1, min(5, 4 - (NIVELES_PHQ9[severity][0] // 8))) if estado_civil in ('casado', 'union_libre') else None,
        'apoyo_social_percibido': 5 if tiene_red else random.randint(1, 2),
        'num_personas_confianza': random.randint(3, 6) if tiene_red else random.randint(0, 1),
        'vive_solo': estado_civil == 'soltero' and random.random() < 0.3,
        'tipo_vivienda': random.choice(['propia', 'alquilada', 'prestada', 'otro']),
        'calidad_vivienda': random.randint(3, 5) if zona_residencia == 'urbana' else random.randint(2, 4),
        'acceso_salud_mental': ha_buscado_ayuda,
        'tipo_afiliacion_salud': weighted_choice([('contributivo', 0.40), ('subsidiado', 0.35), ('privado', 0.10), ('ninguno', 0.15)]),
        'distancia_servicio_salud': weighted_choice([('cerca', 0.30), ('moderado', 0.30), ('lejano', 0.25), ('sin_acceso', 0.15)]),
        'enfermedad_cronica': enfermedad_cronica,
        'tipo_enfermedad_cronica': tipo_enfermedad,
        'dolor_cronico': dolor_cronico,
        'tratamiento_medico_actual': tratamiento_medico,
        'medicamentos_actuales': medicamentos,
        'calidad_sueno': calidad_sueno,
        'horas_sueno_promedio': round(horas_sueno, 1),
        'insomnio': insomnio,
        'consume_alcohol': consume_alcohol,
        'frecuencia_alcohol': frecuencia_alcohol,
        'consume_tabaco': consume_tabaco,
        'frecuencia_tabaco': frecuencia_tabaco,
        'consume_drogas': consume_drogas,
        'tipo_drogas': tipo_drogas,
        'frecuencia_drogas': frecuencia_drogas,
        'erq_reevaluacion_cognitiva': erq_reevaluacion,
        'erq_supresion_expresiva': erq_supresion,
        'impulsividad_motora': impulsividad_motora,
        'impulsividad_no_planificada': impulsividad_no_planificada,
        'impulsividad_atencional': impulsividad_atencional,
        'perdida_familiar_reciente': bhs_level == 'alto' and random.random() < 0.3,
        'violencia_fisica': severity == 'severo' and random.random() < 0.15,
        'violencia_psicologica': severity in ('severo', 'moderadamente_severo') and random.random() < 0.2,
        'abuso_sexual': cssrs_level == 'intento_letal' and random.random() < 0.1,
        'bullying': edad <= 20 and severity != 'minimo' and random.random() < 0.2,
        'desempleo_reciente': 'desempleado' in ocupacion.lower(),
        'rupture_pareja_reciente': estado_civil in ('divorciado', 'soltero') and severity != 'minimo' and random.random() < 0.2,
        'problema_legal_reciente': cssrs_level == 'intento_letal' and random.random() < 0.1,
        'tiene_red_apoyo': tiene_red,
        'percibe_vida_con_sentido': percibe_sentido,
        'ha_buscado_ayuda_profesional': ha_buscado_ayuda,
        'tipo_ayuda_profesional': random.choice(['psicología', 'psiquiatría', 'medicina general']) if ha_buscado_ayuda else None,
        'num_intentos_previos': num_intentos,
        'primer_intento_edad': primer_intento_edad,
        'ultimo_intento_fecha': ultimo_intento_fecha,
        'metodo_intento': metodo_intento_h,
        'hospitalizacion_por_intento': hospitalizacion,
        'tratamiento_psiquiatrico_previo': ha_buscado_ayuda,
        'antecedentes_familiares_suicidio': random.random() < 0.1,
        'antecedentes_familiares_enfermedad_mental': random.random() < 0.2,
    }


def insert_data(cursor, profile):
    cursor.execute("""
        INSERT INTO encuestas (usuario_id, nombre, apellido, edad, sexo, estado_civil,
            nivel_educativo, ocupacion, ingreso_mensual, zona_residencia, estado_usuario,
            causa_fallecimiento, fallecimiento_voluntario, fecha_fallecimiento, created_at, fecha_creacion)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        profile['usuario_id'], profile['nombre'], profile['apellido'],
        profile['edad'], profile['sexo'], profile['estado_civil'],
        profile['nivel_educativo'], profile['ocupacion'], profile['ingreso_mensual'],
        profile['zona_residencia'], profile['estado_usuario'],
        profile['causa_fallecimiento'], profile['fallecimiento_voluntario'],
        profile['fecha_fallecimiento'], profile['created_at'], profile['created_at']
    ))
    eid = cursor.lastrowid

    # PHQ-9
    items = profile['phq9_items']
    total = sum(items)
    nivel = calcular_nivel(total, NIVELES_PHQ9)
    cursor.execute("""
        INSERT INTO phq9_respuestas (encuesta_id, interes_actividades, estado_animo, sueno, energia,
            apetito, autoestima, concentracion, psicomotricidad, ideacion_suicida,
            dificultad_funcionamiento, puntaje_total, nivel_gravedad)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (eid, *items, random.randint(0, 3), total, nivel))

    # C-SSRS
    cssrs, nivel_sev = profile['cssrs_data']
    cursor.execute("""
        INSERT INTO cssrs_respuestas (encuesta_id, deseos_morir, pensamientos_suicidas,
            metodo_sin_plan, intencion_sin_plan, plan_especifico, intencion_ejecutar,
            intento_previo, fecha_ultimo_intento, metodo_intento, nivel_severidad)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (eid, cssrs['deseos_morir'], cssrs['pensamientos_suicidas'],
          cssrs['metodo_sin_plan'], cssrs['intencion_sin_plan'], cssrs['plan_especifico'],
          cssrs['intencion_ejecutar'], cssrs['intento_previo'], cssrs['fecha_ultimo_intento'],
          cssrs['metodo_intento'], nivel_sev))

    # BHS
    bhs_items = profile['bhs_items']
    bhs_total = sum(1 for x in bhs_items if x)
    bhs_nivel = calcular_nivel(bhs_total, NIVELES_BHS)
    cursor.execute("""
        INSERT INTO bhs_respuestas (encuesta_id, item_1, item_2, item_3, item_4, item_5,
            item_6, item_7, item_8, item_9, item_10, item_11, item_12, item_13,
            item_14, item_15, item_16, item_17, item_18, item_19, item_20,
            puntaje_total, nivel_riesgo)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (eid, *[1 if x else 0 for x in bhs_items], bhs_total, bhs_nivel))

    # Rosenberg
    rosenberg = profile['rosenberg_items']
    cursor.execute("""
        INSERT INTO rosenberg_respuestas (encuesta_id, item1, item2, item3, item4, item5,
            item6, item7, item8, item9, item10)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (eid, *rosenberg))

    # DASS-21
    dass_items = profile['dass21_items']
    estres = calcular_dass21_subscale(dass_items, ESTRES_IDX)
    ansiedad = calcular_dass21_subscale(dass_items, ANSIEDAD_IDX)
    depresion = calcular_dass21_subscale(dass_items, DEPRESION_IDX)
    cursor.execute("""
        INSERT INTO dass21_respuestas (encuesta_id, item_1, item_2, item_3, item_4, item_5,
            item_6, item_7, item_8, item_9, item_10, item_11, item_12, item_13,
            item_14, item_15, item_16, item_17, item_18, item_19, item_20, item_21,
            puntaje_estres, puntaje_ansiedad, puntaje_depresion)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (eid, *dass_items, estres, ansiedad, depresion))

    # Factores Socioeconomicos
    cursor.execute("""
        INSERT INTO factores_socioeconomicos (encuesta_id, estado_laboral, satisfaccion_laboral,
            horas_trabajo_semanal, estres_laboral, nivel_deudas, dificultad_economica,
            calidad_relaciones_familiares, calidad_relaciones_pareja, apoyo_social_percibido,
            num_personas_confianza, vive_solo, tipo_vivienda, calidad_vivienda,
            acceso_salud_mental, tipo_afiliacion_salud, distancia_servicio_salud)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        eid, profile['estado_laboral'], profile['satisfaccion_laboral'],
        profile['horas_trabajo_semanal'], profile['estres_laboral'], profile['nivel_deudas'],
        profile['dificultad_economica'], profile['calidad_relaciones_familiares'],
        profile['calidad_relaciones_pareja'], profile['apoyo_social_percibido'],
        profile['num_personas_confianza'], profile['vive_solo'], profile['tipo_vivienda'],
        profile['calidad_vivienda'], profile['acceso_salud_mental'], profile['tipo_afiliacion_salud'],
        profile['distancia_servicio_salud']
    ))

    # Salud Física
    cursor.execute("""
        INSERT INTO salud_fisica (encuesta_id, enfermedad_cronica, tipo_enfermedad_cronica,
            dolor_cronico, tratamiento_medico_actual, medicamentos_actuales,
            calidad_sueno, horas_sueno_promedio, insomnio, consume_alcohol,
            frecuencia_alcohol, consume_tabaco, frecuencia_tabaco, consume_drogas,
            tipo_drogas, frecuencia_drogas)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        eid, profile['enfermedad_cronica'], profile['tipo_enfermedad_cronica'],
        profile['dolor_cronico'], profile['tratamiento_medico_actual'], profile['medicamentos_actuales'],
        profile['calidad_sueno'], profile['horas_sueno_promedio'], profile['insomnio'],
        profile['consume_alcohol'], profile['frecuencia_alcohol'], profile['consume_tabaco'],
        profile['frecuencia_tabaco'], profile['consume_drogas'], profile['tipo_drogas'],
        profile['frecuencia_drogas']
    ))

    # Factores Psicológicos
    cursor.execute("""
        INSERT INTO factores_psicologicos (encuesta_id, erq_reevaluacion_cognitiva,
            erq_supresion_expresiva, impulsividad_motora, impulsividad_no_planificada,
            impulsividad_atencional, perdida_familiar_reciente, violencia_fisica,
            violencia_psicologica, abuso_sexual, bullying, desempleo_reciente,
            rupture_pareja_reciente, problema_legal_reciente, tiene_red_apoyo,
            percibe_vida_con_sentido, ha_buscado_ayuda_profesional, tipo_ayuda_profesional)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        eid, profile['erq_reevaluacion_cognitiva'], profile['erq_supresion_expresiva'],
        profile['impulsividad_motora'], profile['impulsividad_no_planificada'],
        profile['impulsividad_atencional'], profile['perdida_familiar_reciente'],
        profile['violencia_fisica'], profile['violencia_psicologica'], profile['abuso_sexual'],
        profile['bullying'], profile['desempleo_reciente'], profile['rupture_pareja_reciente'],
        profile['problema_legal_reciente'], profile['tiene_red_apoyo'],
        profile['percibe_vida_con_sentido'], profile['ha_buscado_ayuda_profesional'],
        profile['tipo_ayuda_profesional']
    ))

    # Historial de Intentos
    if profile['num_intentos_previos'] > 0:
        cursor.execute("""
            INSERT INTO historial_intentos (encuesta_id, num_intentos_previos, primer_intento_edad,
                ultimo_intento_fecha, metodo_intento, hospitalizacion_por_intento,
                tratamiento_psiquiatrico_previo, antecedentes_familiares_suicidio,
                antecedentes_familiares_enfermedad_mental)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            eid, profile['num_intentos_previos'], profile['primer_intento_edad'],
            profile['ultimo_intento_fecha'], profile['metodo_intento'],
            profile['hospitalizacion_por_intento'], profile['tratamiento_psiquiatrico_previo'],
            profile['antecedentes_familiares_suicidio'], profile['antecedentes_familiares_enfermedad_mental']
        ))

    # Generar notificación basada en riesgo
    phq9_total = sum(profile['phq9_items'])
    bhs_total_val = sum(1 for x in profile['bhs_items'] if x)
    consume_sustancias = profile['consume_drogas'] or (profile['consume_alcohol'] and profile['frecuencia_alcohol'] in ('frecuente', 'diario'))
    aislamiento = profile['vive_solo'] or profile['num_personas_confianza'] == 0

    riesgo_nivel, riesgo_puntos = calcular_riesgo_global(
        phq9_total, bhs_total_val, nivel_sev,
        profile['phq9_items'][8],  # ideacion suicida PHQ-9
        profile['intento_previo'] if isinstance(profile.get('intento_previo'), bool) else profile['cssrs_data'][0]['intento_previo'],
        consume_sustancias, aislamiento
    )

    # Solo generar notificación si riesgo >= moderado (60% de probabilidad)
    if riesgo_nivel in ('muy_alto', 'alto', 'moderado') and random.random() < 0.6:
        nombre_paciente = profile['nombre'] or 'Anónimo'
        apellido_paciente = profile['apellido'] or ''
        nombre_completo = f"{nombre_paciente} {apellido_paciente}".strip()

        if riesgo_nivel == 'muy_alto':
            titulo = f"⚠️ RIESGO CRÍTICO: {nombre_completo}"
            descripcion = f"Paciente con nivel de riesgo MUY ALTO. PHQ-9: {phq9_total}, C-SSRS: {nivel_sev}. Requiere intervención inmediata."
            accion = "Contactar al paciente inmediatamente. Considerar derivación a servicios de emergencia."
        elif riesgo_nivel == 'alto':
            titulo = f"🔴 Riesgo Alto: {nombre_completo}"
            descripcion = f"Paciente con nivel de riesgo ALTO. PHQ-9: {phq9_total}, C-SSRS: {nivel_sev}."
            accion = "Programar cita de seguimiento dentro de 48 horas."
        else:
            titulo = f"🟡 Riesgo Moderado: {nombre_completo}"
            descripcion = f"Paciente con nivel de riesgo MODERADO. PHQ-9: {phq9_total}."
            accion = "Seguimiento semanal recomendado."

        leida = random.random() < 0.3
        respuesta = None
        fecha_lectura = None
        fecha_respuesta = None
        if leida:
            fecha_lectura = profile['created_at']
            if random.random() < 0.5:
                respuestas_admin = [
                    "Cita programada para el lunes a las 10am.",
                    "Se realizó llamada de seguimiento. Paciente estable.",
                    "Derivado a psiquiatría. En espera de valoración.",
                    "Paciente contactado. Niega ideación actual.",
                    "Se envía a urgencias por nivel de riesgo.",
                    "Seguimiento telefónico agendado para mañana.",
                ]
                respuesta = random.choice(respuestas_admin)
                fecha_respuesta = profile['created_at']

        cursor.execute("""
            INSERT INTO notificaciones (encuesta_id, tipo_riesgo, titulo, descripcion,
                leida, accion_requerida, respuesta, fecha_creacion, fecha_lectura, fecha_respuesta)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            eid, riesgo_nivel, titulo, descripcion,
            1 if leida else 0, accion, respuesta,
            profile['created_at'], fecha_lectura, fecha_respuesta
        ))

    return eid


def main():
    NUM_SURVEYS = int(sys.argv[1]) if len(sys.argv) > 1 else 200

    conn = get_db_connection()
    cursor = conn.cursor()

    user_ids = get_existing_user_ids(cursor)
    print(f"Usuarios existentes para vincular: {len(user_ids)}")

    cursor.execute("SELECT COUNT(*) FROM encuestas")
    total_before = cursor.fetchone()[0]

    print(f"Agregando {NUM_SURVEYS} encuestas nuevas... (total actual: {total_before})")
    print("=" * 60)

    created = 0
    failed = 0
    notif_count = 0

    for i in range(NUM_SURVEYS):
        try:
            profile = generate_profile(user_ids)
            encuesta_id = insert_data(cursor, profile)

            cursor.execute("SELECT COUNT(*) FROM notificaciones WHERE encuesta_id = %s", (encuesta_id,))
            if cursor.fetchone()[0] > 0:
                notif_count += 1

            conn.commit()
            created += 1
            print(f"\r  [{created}/{NUM_SURVEYS}] #{encuesta_id} ({profile['sexo'][:3]}, {profile['edad']}a) {'⚠️' if notif_count else ''}", end="", flush=True)
        except Exception as e:
            conn.rollback()
            failed += 1
            print(f"\n  ERROR #{i+1}: {e}")

    print(f"\n\n{'=' * 60}")
    print(f"CREADOS: {created} | ERRORES: {failed} | NOTIFICACIONES: {notif_count}")
    print(f"Total en DB: {total_before + created}")

    cursor.execute("SELECT nivel_gravedad, COUNT(*) FROM phq9_respuestas GROUP BY nivel_gravedad")
    print("\nPHQ-9:")
    for r in cursor.fetchall(): print(f"  {r[0]}: {r[1]}")

    cursor.execute("SELECT nivel_severidad, COUNT(*) FROM cssrs_respuestas GROUP BY nivel_severidad")
    print("\nC-SSRS:")
    for r in cursor.fetchall(): print(f"  {r[0]}: {r[1]}")

    cursor.execute("SELECT nivel_riesgo, COUNT(*) FROM bhs_respuestas GROUP BY nivel_riesgo")
    print("\nBHS:")
    for r in cursor.fetchall(): print(f"  {r[0]}: {r[1]}")

    cursor.execute("SELECT estado_usuario, COUNT(*) FROM encuestas GROUP BY estado_usuario")
    print("\nUsuarios:")
    for r in cursor.fetchall(): print(f"  {r[0]}: {r[1]}")

    cursor.execute("SELECT tipo_riesgo, COUNT(*) FROM notificaciones GROUP BY tipo_riesgo")
    print("\nNotificaciones por riesgo:")
    for r in cursor.fetchall(): print(f"  {r[0]}: {r[1]}")

    cursor.close()
    conn.close()


if __name__ == '__main__':
    main()
