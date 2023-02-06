/*
 SQL script to create database views
 */

use fpcs_cslf;

# Reset the view if it already exists
drop view if exists view_lesson_resources;

# Initialise the view
create view view_lesson_resources as
	select l.title as lesson_title, l.id as lesson_id,
	       r.id as res_id, r.filetype, r.filename, r.originalname,
	       r.filepath
	from resource r
	join activity_resource ar on r.id = ar.resource_id
	join activity a on ar.activity_id = a.id
	join lesson_activity la on a.id = la.activity_id
	join lesson l on la.lesson_id = l.id;