"""
Script para generar el dataset de demostración con errores intencionales para el Notebook de Google Colab.
Genera 4,000 registros de salud mental con errores controlados de captura, duplicados, inconsistencias,
valores nulos y distinción entre outliers de error vs outliers clínicos legítimos.
"""

import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generar_dataset_sucio(n_filas=4000, seed=42):
    random.seed(seed)
    np.random.seed(seed)
    
    fecha_base = datetime(2026, 1, 1)
    
    ocupaciones_base = [
        "Estudiante", "Ingeniero", "Docente", "Comerciante", "Médico",
        "Enfermero", "Abogado", "Desempleado", "Empleado Administrativo",
        "Diseñador", "Psicólogo", "Contador", "Técnico", "Obrero", "Independiente"
    ]
    
    estados_civiles = ["soltero", "casado", "divorciado", "union_libre", "viudo"]
    niveles_educativos = ["primaria", "secundaria", "tecnico", "universitario", "posgrado"]
    ingresos = ["menos_1_smlv", "1_2_smlv", "2_4_smlv", "4_8_smlv", "mas_8_smlv"]
    zonas = ["urbana", "rural"]
    
    textos_riesgo = [
        "Me siento completamente agotado y sin salida.",
        "Siento que soy una carga para mi familia y ya no puedo más.",
        "Todo parece oscuro y no tengo motivos para continuar.",
        "Tengo crisis de pánico casi todos los días y nadie me entiende.",
        "Solo quisiera dormir y no volver a despertar."
    ]
    
    textos_neutros = [
        "Últimamente he tenido un poco de estrés por los exámenes de la universidad.",
        "A veces tengo problemas para dormir por las noches.",
        "Me siento bien en general, solo algo cansado por el trabajo.",
        "Gracias por la evaluación, me parece una buena iniciativa.",
        "Todo normal en mi día a día."
    ]
    
    registros = []
    
    for i in range(1, n_filas + 1):
        id_reg = f"USR_{i:05d}"
        dias_offset = random.randint(0, 180)
        minutos_offset = random.randint(0, 1439)
        fecha_resp = (fecha_base + timedelta(days=dias_offset, minutes=minutos_offset)).strftime("%Y-%m-%d %H:%M")
        
        # Perfil de riesgo latente: 65% Bajo, 20% Moderado, 10% Alto, 5% Muy Alto
        perfil = np.random.choice(["bajo", "moderado", "alto", "muy_alto"], p=[0.65, 0.20, 0.10, 0.05])
        
        # Demografía normal
        edad = int(np.random.normal(24, 8))
        edad = max(14, min(75, edad))
        sexo = np.random.choice(["femenino", "masculino", "no_binario", "otro"], p=[0.52, 0.44, 0.03, 0.01])
        estado_civil = random.choice(estados_civiles)
        nivel_educativo = random.choice(niveles_educativos)
        ocupacion = random.choice(ocupaciones_base)
        ingreso = random.choice(ingresos)
        zona = np.random.choice(zonas, p=[0.82, 0.18])
        
        # Escalas clínicas según perfil latente
        if perfil == "bajo":
            phq9_items = [np.random.choice([0, 1], p=[0.85, 0.15]) for _ in range(8)]
            phq9_i9 = 0
            bhs_items_true = random.randint(0, 4)
            cssrs_nivel = "ninguna"
            rosenberg_base = random.randint(28, 38)
            dass_estres = random.randint(2, 12)
            dass_ansiedad = random.randint(0, 8)
            dass_depresion = random.randint(0, 10)
            consume_drogas = np.random.choice([False, True], p=[0.95, 0.05])
            frec_alcohol = np.random.choice(["nunca", "ocasional", "moderado"], p=[0.60, 0.35, 0.05])
            horas_sueno = round(random.uniform(6.5, 8.5), 1)
            calidad_sueno = random.randint(3, 5)
            tiene_apoyo = True
            violencia = False
            perdida = np.random.choice([False, True], p=[0.92, 0.08])
            texto = random.choice(textos_neutros) if random.random() < 0.3 else ""
            
        elif perfil == "moderado":
            phq9_items = [np.random.choice([0, 1, 2], p=[0.3, 0.5, 0.2]) for _ in range(8)]
            phq9_i9 = np.random.choice([0, 1], p=[0.8, 0.2])
            bhs_items_true = random.randint(5, 9)
            cssrs_nivel = np.random.choice(["ninguna", "ideacion"], p=[0.7, 0.3])
            rosenberg_base = random.randint(20, 29)
            dass_estres = random.randint(14, 24)
            dass_ansiedad = random.randint(10, 18)
            dass_depresion = random.randint(12, 22)
            consume_drogas = np.random.choice([False, True], p=[0.88, 0.12])
            frec_alcohol = np.random.choice(["nunca", "ocasional", "moderado", "frecuente"], p=[0.40, 0.40, 0.15, 0.05])
            horas_sueno = round(random.uniform(5.0, 7.0), 1)
            calidad_sueno = random.randint(2, 4)
            tiene_apoyo = np.random.choice([True, False], p=[0.75, 0.25])
            violencia = np.random.choice([False, True], p=[0.85, 0.15])
            perdida = np.random.choice([False, True], p=[0.75, 0.25])
            texto = random.choice(textos_neutros + textos_riesgo[:2]) if random.random() < 0.4 else ""
            
        elif perfil == "alto":
            phq9_items = [np.random.choice([1, 2, 3], p=[0.2, 0.5, 0.3]) for _ in range(8)]
            phq9_i9 = np.random.choice([1, 2], p=[0.6, 0.4])
            bhs_items_true = random.randint(10, 14)
            cssrs_nivel = np.random.choice(["ideacion", "intento_no_letal"], p=[0.5, 0.5])
            rosenberg_base = random.randint(14, 22)
            dass_estres = random.randint(22, 34)
            dass_ansiedad = random.randint(16, 28)
            dass_depresion = random.randint(22, 32)
            consume_drogas = np.random.choice([False, True], p=[0.75, 0.25])
            frec_alcohol = np.random.choice(["ocasional", "moderado", "frecuente"], p=[0.25, 0.45, 0.30])
            horas_sueno = round(random.uniform(3.5, 6.0), 1)
            calidad_sueno = random.randint(1, 3)
            tiene_apoyo = np.random.choice([True, False], p=[0.40, 0.60])
            violencia = np.random.choice([False, True], p=[0.65, 0.35])
            perdida = np.random.choice([False, True], p=[0.55, 0.45])
            texto = random.choice(textos_riesgo) if random.random() < 0.6 else ""
            
        else: # muy_alto (crítico)
            phq9_items = [np.random.choice([2, 3], p=[0.3, 0.7]) for _ in range(8)]
            phq9_i9 = np.random.choice([2, 3], p=[0.3, 0.7])
            bhs_items_true = random.randint(15, 20)
            cssrs_nivel = np.random.choice(["intento_no_letal", "planificacion", "intento_letal"], p=[0.3, 0.4, 0.3])
            rosenberg_base = random.randint(10, 16)
            dass_estres = random.randint(30, 42)
            dass_ansiedad = random.randint(24, 42)
            dass_depresion = random.randint(30, 42)
            consume_drogas = np.random.choice([False, True], p=[0.55, 0.45])
            frec_alcohol = np.random.choice(["moderado", "frecuente", "diario"], p=[0.20, 0.45, 0.35])
            horas_sueno = round(random.uniform(2.0, 5.0), 1)
            calidad_sueno = 1
            tiene_apoyo = False
            violencia = np.random.choice([False, True], p=[0.45, 0.55])
            perdida = np.random.choice([False, True], p=[0.35, 0.65])
            texto = random.choice(textos_riesgo)
            
        phq9_items.append(phq9_i9)
        phq9_total = sum(phq9_items)
        
        row = {
            "id_registro": id_reg,
            "fecha_respuesta": fecha_resp,
            "edad": edad,
            "sexo": sexo,
            "estado_civil": estado_civil,
            "nivel_educativo": nivel_educativo,
            "ocupacion": ocupacion,
            "ingreso_mensual": ingreso,
            "zona_residencia": zona,
            "phq9_item_1": phq9_items[0],
            "phq9_item_2": phq9_items[1],
            "phq9_item_3": phq9_items[2],
            "phq9_item_4": phq9_items[3],
            "phq9_item_5": phq9_items[4],
            "phq9_item_6": phq9_items[5],
            "phq9_item_7": phq9_items[6],
            "phq9_item_8": phq9_items[7],
            "phq9_item_9_ideacion": phq9_items[8],
            "phq9_puntaje_total": phq9_total,
            "cssrs_nivel_severidad": cssrs_nivel,
            "bhs_desesperanza_total": bhs_items_true,
            "rosenberg_autoestima_total": rosenberg_base,
            "dass21_estres": dass_estres,
            "dass21_ansiedad": dass_ansiedad,
            "dass21_depresion": dass_depresion,
            "calidad_sueno_1a5": calidad_sueno,
            "horas_sueno_promedio": horas_sueno,
            "consume_drogas": consume_drogas,
            "frecuencia_alcohol": frec_alcohol,
            "tiene_red_apoyo": tiene_apoyo,
            "violencia_reciente": violencia,
            "perdida_familiar_reciente": perdida,
            "texto_libre_comentario": texto,
            "nivel_riesgo_objetivo": perfil.capitalize()
        }
        registros.append(row)

    df = pd.DataFrame(registros)
    
    print(f"[1] Base sintética generada: {len(df)} filas.")
    
    # =========================================================================
    # INYECCIÓN CONTROLADA DE ERRORES PARA DEMOSTRACIÓN DE LIMPIEZA EN COLAB
    # =========================================================================
    
    # 1. Errores de formato en texto (espacios extra y mezcla de mayúsculas/minúsculas)
    indices_formato = random.sample(range(len(df)), 350)
    for idx in indices_formato:
        val = df.at[idx, "ocupacion"]
        if random.random() < 0.4:
            df.at[idx, "ocupacion"] = f"  {val.upper()}  "
        elif random.random() < 0.7:
            df.at[idx, "ocupacion"] = val.lower()
        else:
            df.at[idx, "ocupacion"] = f"{val} "
            
    # 2. Inconsistencias de categoría en estado_civil y sexo
    indices_cat = random.sample(range(len(df)), 120)
    for idx in indices_cat:
        if random.random() < 0.5:
            df.at[idx, "estado_civil"] = random.choice(["SOLTERO(A)", "solter@", "Divorciad@", "casad@"])
        else:
            df.at[idx, "sexo"] = random.choice(["M", "F", "masc", "fem", "Hombre", "Mujer"])
            
    # 3. Valores Nulos intencionales (MCAR y MAR)
    # Nulos en ocupación (ej. omisión voluntaria)
    indices_nulos_ocup = random.sample(range(len(df)), 240)
    df.loc[indices_nulos_ocup, "ocupacion"] = np.nan
    
    # Nulos en ingreso mensual
    indices_nulos_ingreso = random.sample(range(len(df)), 180)
    df.loc[indices_nulos_ingreso, "ingreso_mensual"] = np.nan
    
    # Nulos en horas de sueño
    indices_nulos_sueno = random.sample(range(len(df)), 150)
    df.loc[indices_nulos_sueno, "horas_sueno_promedio"] = np.nan

    # 4. Outliers de Error de Captura (Imposibles clínicamente)
    indices_error_edad = random.sample(range(len(df)), 45)
    for idx in indices_error_edad:
        df.at[idx, "edad"] = random.choice([-5, 0, 199, 250, 999])
        
    indices_error_sueno = random.sample(range(len(df)), 30)
    for idx in indices_error_sueno:
        df.at[idx, "horas_sueno_promedio"] = random.choice([-2.0, 36.0, 48.0, 100.0])
        
    indices_error_phq9 = random.sample(range(len(df)), 25)
    for idx in indices_error_phq9:
        df.at[idx, "phq9_puntaje_total"] = random.choice([-10, 35, 45, 99])

    # 5. Duplicados artificiales (~150 registros duplicados)
    indices_duplicar = random.sample(range(len(df)), 150)
    duplicados = df.iloc[indices_duplicar].copy()
    df = pd.concat([df, duplicados], ignore_index=True)
    
    # Mezclar aleatoriamente el orden del dataframe
    df = df.sample(frac=1.0, random_state=seed).reset_index(drop=True)
    
    print(f"[2] Inyección completada: {len(df)} filas totales (incluyendo duplicados y anomalías).")
    return df

if __name__ == "__main__":
    df_sucio = generar_dataset_sucio(n_filas=4000)
    output_path = "notebooks/dataset_salud_mental_sucio_demostracion.csv"
    df_sucio.to_csv(output_path, index=False, encoding="utf-8-sig")
    print(f"[OK] Dataset sucio guardado en: {output_path}")
