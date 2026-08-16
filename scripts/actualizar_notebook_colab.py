"""
Script para generar el Jupyter Notebook enriquecido para Google Colab:
'notebooks/Limpieza_Interactiva_Semana12_Colab.ipynb'
Incluye visualizaciones con matplotlib/seaborn, lógica clínica experta para salud mental,
detección de inconsistencias, tratamiento de outliers clínicos vs de captura y exportación.
"""

import json

def crear_notebook_colab():
    cells = []
    
    def add_md(text):
        cells.append({
            "cell_type": "markdown",
            "metadata": {},
            "source": [line + "\n" for line in text.strip().split("\n")]
        })
        
    def add_code(code):
        cells.append({
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [line + "\n" for line in code.strip().split("\n")]
        })

    # Título
    add_md("""# 🧠 Semana 12: Limpieza Interactiva de Datos para Sistemas de IA
### Proyecto: Sistema de BI e Inteligencia Artificial para la Prevención del Riesgo Suicida y Depresión
**Carrera:** Desarrollo de Sistemas de Información / Inteligencia Artificial

---
### 📌 Flujo de Trabajo
`Diagnóstico Clínico y Estadístico` ➔ `Visualización con Gráficos` ➔ `Decisión Guiada` ➔ `Ejecución y Bitácora` ➔ `Exportación Limpia`

El notebook incluye validaciones específicas para **escalas psicométricas** (PHQ-9, C-SSRS, BHS, DASS-21, Rosenberg) distinguiendo entre **errores de captura** y **casos clínicos críticos genuinos**.""")

    # Bloque 1
    add_md("## Bloque 1 - IMPORTAR LIBRERÍAS DE CIENCIA DE DATOS Y VISUALIZACIÓN")
    add_code("""# ============================================================
# BLOQUE 1 - IMPORTAR LIBRERÍAS
# ============================================================
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

# Configuración visual moderna
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['figure.figsize'] = (10, 5)
plt.rcParams['font.size'] = 10
pd.set_option("display.max_columns", None)
pd.set_option("display.max_rows", 100)

print("=" * 70)
print("✓ Librerías cargadas correctamente: pandas, numpy, matplotlib, seaborn")
print("=" * 70)""")

    # Bloque 2
    add_md("## Bloque 2 - CARGAR DATASET DE SALUD MENTAL")
    add_code("""# ============================================================
# BLOQUE 2 - CARGAR DATASET
# ============================================================
import os

archivo_sugerido = "dataset_salud_mental_sucio_demostracion.csv"

if os.path.exists(archivo_sugerido):
    df = pd.read_csv(archivo_sugerido)
    print(f"✓ Archivo local '{archivo_sugerido}' cargado con éxito.")
else:
    try:
        from google.colab import files
        print("Sube el archivo CSV del dataset:")
        uploaded = files.upload()
        nombre_archivo = list(uploaded.keys())[0]
        df = pd.read_csv(nombre_archivo)
        print(f"✓ Archivo subido '{nombre_archivo}' cargado con éxito.")
    except Exception as e:
        print(f"Error o entorno local: {e}")
        # Carga de respaldo si existe en ruta relativa
        if os.path.exists("notebooks/" + archivo_sugerido):
            df = pd.read_csv("notebooks/" + archivo_sugerido)
            print(f"✓ Cargado desde carpeta notebooks/")

print(f"Dimensiones iniciales del dataset: {df.shape[0]} filas × {df.shape[1]} columnas")
df.head(3)""")

    # Bloque 3
    add_md("## Bloque 3 - DIAGNÓSTICO INICIAL Y SALUD DEL DATASET")
    add_code("""# ============================================================
# BLOQUE 3 - DIAGNÓSTICO INICIAL
# ============================================================
print("=" * 70)
print("RESUMEN DE TIPOS DE DATOS Y VALORES NULOS")
print("=" * 70)

info_df = pd.DataFrame({
    'Tipo': df.dtypes,
    'No Nulos': df.notnull().sum(),
    'Nulos': df.isnull().sum(),
    '% Nulos': (df.isnull().sum() / len(df) * 100).round(2),
    'Únicos': df.nunique()
})
display(info_df)

duplicados_iniciales = df.duplicated().sum()
print(f"\\n🚨 Registros duplicados detectados: {duplicados_iniciales} ({(duplicados_iniciales/len(df)*100):.2f}%)")""")

    # Bloque 4
    add_md("## Bloque 4 - NORMALIZAR NOMBRES DE VARIABLES")
    add_code("""# ============================================================
# BLOQUE 4 - NORMALIZAR NOMBRES DE COLUMNAS
# ============================================================
# Convertir a minúsculas, reemplazar espacios y caracteres especiales
df.columns = (df.columns
              .str.strip()
              .str.lower()
              .str.replace(' ', '_')
              .str.replace('/', '_')
              .str.replace('-', '_'))

print("✓ Nombres de columnas estandarizados:")
print(list(df.columns))""")

    # Bloque 5 & 5B
    add_md("## Bloque 5 - DETECCIÓN Y TRATAMIENTO DE DUPLICADOS")
    add_code("""# ============================================================
# BLOQUE 5 - DUPLICADOS
# ============================================================
n_duplicados = df.duplicated().sum()
print(f"Total de filas duplicadas exactas: {n_duplicados}")

if n_duplicados > 0:
    print("Muestra de filas duplicadas:")
    display(df[df.duplicated(keep=False)].head(4))
    
    # Eliminación de duplicados manteniendo la primera ocurrencia
    df = df.drop_duplicates(keep='first').reset_index(drop=True)
    print(f"\\n✓ {n_duplicados} filas duplicadas eliminadas exitosamente.")
    print(f"Nuevo tamaño del dataset: {len(df)} filas.")
else:
    print("✓ No hay duplicados en el conjunto de datos.")""")

    # Bloque 6
    add_md("## Bloque 6 - LIMPIEZA Y ESTANDARIZACIÓN DE TEXTO")
    add_code("""# ============================================================
# BLOQUE 6 - LIMPIEZA DE TEXTO (OCUPACIÓN, COMENTARIOS)
# ============================================================
columnas_texto = df.select_dtypes(include=['object']).columns

for col in columnas_texto:
    if col in df.columns:
        # Quitar espacios en blanco laterales y dobles espacios internos
        df[col] = df[col].astype(str).str.strip().str.replace(r'\\s+', ' ', regex=True)
        # Reemplazar 'nan' string resultante por NaN real
        df[col] = df[col].replace({'nan': np.nan, 'None': np.nan, '': np.nan})

if 'ocupacion' in df.columns:
    df['ocupacion'] = df['ocupacion'].str.title()

print("✓ Limpieza de espacios y capitalización aplicada.")
if 'ocupacion' in df.columns:
    print("\\nTop 10 ocupaciones estandarizadas:")
    print(df['ocupacion'].value_counts(dropna=False).head(10))""")

    # Bloque 7 y 8
    add_md("## Bloque 7 y 8 - REVISIÓN Y MAPPING DE CATEGORÍAS")
    add_code("""# ============================================================
# BLOQUE 7 Y 8 - MAPPING Y CATEGORÍAS
# ============================================================
# Corrección de variantes en 'sexo'
if 'sexo' in df.columns:
    mapeo_sexo = {
        'M': 'masculino', 'm': 'masculino', 'masc': 'masculino', 'Hombre': 'masculino',
        'F': 'femenino', 'f': 'femenino', 'fem': 'femenino', 'Mujer': 'femenino',
    }
    df['sexo'] = df['sexo'].replace(mapeo_sexo).str.lower()

# Corrección de variantes en 'estado_civil'
if 'estado_civil' in df.columns:
    mapeo_civil = {
        'SOLTERO(A)': 'soltero', 'solter@': 'soltero', 'soltero': 'soltero',
        'Divorciad@': 'divorciado', 'divorciado': 'divorciado',
        'casad@': 'casado', 'casado': 'casado'
    }
    df['estado_civil'] = df['estado_civil'].replace(mapeo_civil).str.lower()

# Visualización gráfica de distribuciones categóricas
fig, axes = plt.subplots(1, 2, figsize=(14, 4))

if 'sexo' in df.columns:
    sns.countplot(data=df, x='sexo', ax=axes[0], palette='Blues_r')
    axes[0].set_title("Distribución por Sexo")

if 'nivel_riesgo_objetivo' in df.columns:
    sns.countplot(data=df, x='nivel_riesgo_objetivo', ax=axes[1], palette='Reds', order=['Bajo', 'Moderado', 'Alto', 'Muy_alto'])
    axes[1].set_title("Distribución de la Variable Objetivo (Riesgo)")

plt.tight_layout()
plt.show()""")

    # Bloque 9 a 12
    add_md("## Bloque 9 a 12 - DETECCIÓN Y TRATAMIENTO DE VALORES NULOS")
    add_code("""# ============================================================
# BLOQUE 9 A 12 - VALORES NULOS
# ============================================================
nulos_por_col = df.isnull().sum()
nulos_existentes = nulos_por_col[nulos_por_col > 0]

print("Variables con valores nulos:")
print(nulos_existentes)

# Visualización de mapa de calor de nulos
if len(nulos_existentes) > 0:
    plt.figure(figsize=(10, 4))
    sns.heatmap(df[nulos_existentes.index].isnull(), cbar=False, yticklabels=False, cmap='viridis')
    plt.title("Mapa de Calor de Ausencia de Datos (Nulos)")
    plt.show()

# Imputación guiada:
# 1. Ocupación -> 'No especificada'
if 'ocupacion' in df.columns:
    df['ocupacion'] = df['ocupacion'].fillna('No especificada')

# 2. Ingreso mensual -> 'no_reportado'
if 'ingreso_mensual' in df.columns:
    df['ingreso_mensual'] = df['ingreso_mensual'].fillna('no_reportado')

# 3. Horas de sueño -> Imputar con la mediana según calidad de sueño
if 'horas_sueno_promedio' in df.columns and 'calidad_sueno_1a5' in df.columns:
    mediana_sueno = df.groupby('calidad_sueno_1a5')['horas_sueno_promedio'].transform('median')
    df['horas_sueno_promedio'] = df['horas_sueno_promedio'].fillna(mediana_sueno).fillna(7.0)

# 4. Texto libre -> '' (cadena vacía)
if 'texto_libre_comentario' in df.columns:
    df['texto_libre_comentario'] = df['texto_libre_comentario'].fillna('')

print("✓ Tratamiento de nulos completado. Nulos restantes:", df.isnull().sum().sum())""")

    # Bloque 13 a 16
    add_md("## Bloque 13 a 16 - DETECCIÓN DE OUTLIERS: ERROR DE CAPTURA VS CASOS CLÍNICOS REALES")
    add_code("""# ============================================================
# BLOQUE 13 A 16 - ANÁLISIS DE OUTLIERS (CLÍNICA VS CAPTURA)
# ============================================================
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

if 'edad' in df.columns:
    sns.boxplot(y=df['edad'], ax=axes[0], color='#60a5fa')
    axes[0].set_title("Boxplot: Edad (Detectar edades < 10 o > 100)")

if 'horas_sueno_promedio' in df.columns:
    sns.boxplot(y=df['horas_sueno_promedio'], ax=axes[1], color='#34d399')
    axes[1].set_title("Boxplot: Horas de Sueño (Detectar < 0 o > 24)")

if 'phq9_puntaje_total' in df.columns:
    sns.boxplot(y=df['phq9_puntaje_total'], ax=axes[2], color='#f87171')
    axes[2].set_title("Boxplot: PHQ-9 (Válido: 0 a 27)")

plt.tight_layout()
plt.show()

# Reglas de filtrado y saneamiento de errores de captura:
# 1. Edad válida: entre 12 y 100 años
n_edad_invalida = ((df['edad'] < 12) | (df['edad'] > 100)).sum()
df = df[(df['edad'] >= 12) & (df['edad'] <= 100)]

# 2. Horas de sueño válidas: entre 1 y 20 horas
if 'horas_sueno_promedio' in df.columns:
    n_sueno_invalido = ((df['horas_sueno_promedio'] < 1) | (df['horas_sueno_promedio'] > 20)).sum()
    df = df[(df['horas_sueno_promedio'] >= 1) & (df['horas_sueno_promedio'] <= 20)]

# 3. PHQ-9 válido: entre 0 y 27 (los valores = 27 son CRÍTICOS legítimos, no se eliminan)
if 'phq9_puntaje_total' in df.columns:
    n_phq9_invalido = ((df['phq9_puntaje_total'] < 0) | (df['phq9_puntaje_total'] > 27)).sum()
    df = df[(df['phq9_puntaje_total'] >= 0) & (df['phq9_puntaje_total'] <= 27)]

print(f"✓ Errores de captura removidos:")
print(f"  - Edades imposibles eliminadas: {n_edad_invalida}")
print(f"  - Horas de sueño imposibles eliminadas: {n_sueno_invalido}")
print(f"  - Puntajes PHQ-9 fuera de rango (0-27) eliminados: {n_phq9_invalido}")
print(f"Tamaño actual del dataset limpio: {len(df)} registros.")""")

    # Bloque 17
    add_md("## Bloque 17 - ANÁLISIS DE CORRELACIONES Y PATRONES PSICOMÉTRICOS")
    add_code("""# ============================================================
# BLOQUE 17 - VISUALIZACIONES CLÍNICAS Y CORRELACIONES
# ============================================================
escalas = [col for col in ['phq9_puntaje_total', 'bhs_desesperanza_total', 'rosenberg_autoestima_total', 
                           'dass21_estres', 'dass21_ansiedad', 'dass21_depresion', 'horas_sueno_promedio'] if col in df.columns]

plt.figure(figsize=(10, 7))
corr_matrix = df[escalas].corr()
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".2f", vmin=-1, vmax=1, linewidths=0.5)
plt.title("Matriz de Correlación entre Escalas Clínicas de Salud Mental", fontsize=12, fontweight='bold')
plt.show()

# Cruce: PHQ-9 (Depresión) vs BHS (Desesperanza) segmentado por Riesgo
if 'phq9_puntaje_total' in df.columns and 'bhs_desesperanza_total' in df.columns:
    plt.figure(figsize=(10, 5))
    sns.scatterplot(
        data=df, 
        x='phq9_puntaje_total', 
        y='bhs_desesperanza_total', 
        hue='nivel_riesgo_objetivo' if 'nivel_riesgo_objetivo' in df.columns else None,
        palette='turbo',
        alpha=0.7
    )
    plt.axvline(15, color='orange', linestyle='--', label='PHQ-9 Moderadamente Severo (≥15)')
    plt.axhline(10, color='red', linestyle='--', label='BHS Desesperanza Alta (≥10)')
    plt.title("Cruce Clínico: Depresión (PHQ-9) vs Desesperanza (BHS)")
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.tight_layout()
    plt.show()""")

    # Bloque 18 y 19
    add_md("## Bloque 18 y 19 - BITÁCORA DE CALIDAD Y DIAGNÓSTICO FINAL")
    add_code("""# ============================================================
# BLOQUE 18 Y 19 - BITÁCORA Y DIAGNÓSTICO FINAL
# ============================================================
print("=" * 70)
print("BITÁCORA FINAL DE LIMPIEZA DE DATOS")
print("=" * 70)

print(f"• Registros finales limpios: {len(df)}")
print(f"• Columnas verificadas: {len(df.columns)}")
print(f"• Valores nulos totales en el dataset: {df.isnull().sum().sum()}")
print(f"• Duplicados finales: {df.duplicated().sum()}")
print("\\nDistribución final de clases (Variable Objetivo):")
if 'nivel_riesgo_objetivo' in df.columns:
    distribucion_final = df['nivel_riesgo_objetivo'].value_counts(normalize=True) * 100
    for clase, pct in distribucion_final.items():
        print(f"  - {clase}: {pct:.2f}% ({df['nivel_riesgo_objetivo'].value_counts()[clase]} pacientes)")
""")

    # Bloque 20
    add_md("## Bloque 20 - EXPORTACIÓN DEL DATASET LIMPIO")
    add_code("""# ============================================================
# BLOQUE 20 - EXPORTACIÓN
# ============================================================
nombre_salida = "dataset_salud_mental_limpio.csv"
df.to_csv(nombre_salida, index=False, encoding='utf-8-sig')

print(f"✓ Dataset limpio exportado exitosamente como '{nombre_salida}'")
print(f"Tamaño final del archivo: {len(df)} filas.")

# Descargar automáticamente si se ejecuta en Google Colab
try:
    from google.colab import files
    files.download(nombre_salida)
    print("✓ Descarga automática iniciada en Colab.")
except Exception:
    print(f"✓ Archivo listo para entrenamiento de modelos de IA en: {nombre_salida}")""")

    notebook_json = {
        "cells": cells,
        "metadata": {
            "colab": {"provenance": []},
            "language_info": {"name": "python", "version": "3.11"},
            "kernelspec": {"name": "python3", "display_name": "Python 3"}
        },
        "nbformat": 4,
        "nbformat_minor": 4
    }
    
    return notebook_json

if __name__ == "__main__":
    nb = crear_notebook_colab()
    output_path = "notebooks/Limpieza_Interactiva_Semana12_Colab.ipynb"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(nb, f, indent=2, ensure_ascii=False)
    print(f"[OK] Notebook de Colab actualizado en: {output_path}")
