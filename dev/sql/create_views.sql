/*
 SQL script to create database views
 */

use fpcs_cslf;

# Reset the view if it already exists
drop view if exists view_lesson_resources;
drop view if exists view_lesson_act;

# Initialise the view
create view view_lesson_resources as
	select l.title as lesson_title, l.id as lesson_id,
	       r.id as res_id, r.filetype, r.filename, r.originalname,
	       r.filepath, la.activity_id as act_id, la.num_in_lesson
	from resource r
	join activity_resource ar on r.id = ar.resource_id
	join activity a on ar.activity_id = a.id
	join lesson_activity la on a.id = la.activity_id
	join lesson l on la.lesson_id = l.id;

# Initialise view to get all activities in a lesson
create view view_lesson_act as
	select l.title as lesson_title, l.id as lesson_id, l.duration as lesson_duration, la.num_in_lesson,
	       l.yeargroup, a.title as act_title, a.description, a.duration as act_duration, a.tags, a.id as act_id
	from lesson l
	join lesson_activity la on l.id = la.lesson_id
	join activity a on la.activity_id = a.id;