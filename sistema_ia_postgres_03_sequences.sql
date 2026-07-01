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
