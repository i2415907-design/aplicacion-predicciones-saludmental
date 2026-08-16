#!/usr/bin/env python3
"""Split PostgreSQL dump into per-table files for Supabase import."""

import re
import os

with open('sistema_ia_postgres.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all CREATE TABLE positions and their table names
creates = list(re.finditer(r'CREATE TABLE "(\w+)"', content))

# Find all INSERT INTO positions
inserts = list(re.finditer(r'INSERT INTO "(\w+)"', content))

# Build a map: table_name -> { create_pos, insert_positions }
table_data = {}
for m in creates:
    name = m.group(1)
    if name not in table_data:
        table_data[name] = {'create': m.start(), 'inserts': []}

for m in inserts:
    name = m.group(1)
    if name in table_data:
        table_data[name]['inserts'].append(m.start())

# Find the header (everything before first CREATE TABLE)
header_end = creates[0].start() if creates else 0
header = content[:header_end].strip()

# Find footer (sequence resets)
footer_start = content.find("-- Reset sequences")
footer = content[footer_start:] if footer_start != -1 else ''

# Split into per-table files
output_dir = 'supabase_import'
os.makedirs(output_dir, exist_ok=True)

# File 1: Header + all CREATE TABLEs + indexes
schema_parts = [header, '']
for m in creates:
    # Find the end of this CREATE TABLE (next semicolon after CREATE)
    end = content.find(');', m.start()) + 2
    schema_parts.append(content[m.start():end])
    schema_parts.append('')

schema_file = os.path.join(output_dir, '00_schema.sql')
with open(schema_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(schema_parts))
print(f'00_schema.sql: {os.path.getsize(schema_file) / 1024:.0f} KB')

# Files per table: data chunks
# Group inserts by table and split large tables
file_num = 1
MAX_CHUNK = 500000  # 500KB per file

for table_name, data in table_data.items():
    if not data['inserts']:
        continue
    
    # Get all INSERT content for this table
    insert_starts = data['inserts']
    
    # Find the end of each INSERT (the semicolon that closes it)
    # But multi-row inserts can span many lines, so we find the next INSERT or CREATE TABLE
    chunks = []
    
    for i, start in enumerate(insert_starts):
        # End is the start of the next INSERT or CREATE TABLE, or end of content
        if i + 1 < len(insert_starts):
            end = insert_starts[i + 1]
        else:
            # Find next CREATE TABLE or footer
            next_create = content.find('CREATE TABLE', start + 10)
            next_footer = content.find('-- Reset sequences', start + 10)
            
            if next_create != -1 and (next_footer == -1 or next_create < next_footer):
                end = next_create
            elif next_footer != -1:
                end = next_footer
            else:
                end = len(content)
        
        chunk = content[start:end].strip()
        
        # If chunk is too large, split by individual INSERT statements
        if len(chunk) > MAX_CHUNK:
            # Split by INSERT INTO
            parts = re.split(r'(INSERT INTO "[^"]+")', chunk)
            current = ''
            for j, part in enumerate(parts):
                if part.startswith('INSERT INTO'):
                    if current and len(current) > 0:
                        chunks.append(current)
                    current = part
                else:
                    current += part
            if current:
                chunks.append(current)
        else:
            chunks.append(chunk)
    
    # Write chunks to files
    for chunk in chunks:
        filename = f'{file_num:02d}_{table_name}.sql'
        filepath = os.path.join(output_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(chunk + '\n')
        size_kb = os.path.getsize(filepath) / 1024
        print(f'{filename}: {size_kb:.0f} KB')
        file_num += 1

# Write footer (sequence resets)
if footer:
    footer_file = os.path.join(output_dir, f'{file_num:02d}_sequences.sql')
    with open(footer_file, 'w', encoding='utf-8') as f:
        f.write(footer + '\n')
    print(f'{file_num:02d}_sequences.sql: {os.path.getsize(footer_file) / 1024:.0f} KB')

print(f'\nDone! {file_num} files created in {output_dir}/')
print('Import in numeric order: 00_schema.sql first, then data files, then sequences last.')
