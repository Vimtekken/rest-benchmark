SET search_path TO public;
--
-- PostgreSQL database dump
--

-- Dumped from database version 10.13
-- Dumped by pg_dump version 10.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name plpgsql; Type EXTENSION; Schema -; Owner 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name EXTENSION plpgsql; Type COMMENT; Schema -; Owner 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name docker_build; Type TABLE; Schema public; Owner postgres
--

CREATE TABLE public.docker_build (
    config_name text,
    duration integer
);


ALTER TABLE public.docker_build OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

CREATE TABLE public.docker_healthy (
    config_name text,
    duration integer
);


ALTER TABLE public.docker_healthy OWNER TO postgres;


CREATE TABLE public.docker_launch (
    config_name text,
    duration integer
);


ALTER TABLE public.docker_launch OWNER TO postgres;


CREATE TABLE public.docker_stop (
    config_name text,
    duration integer
);


ALTER TABLE public.docker_stop OWNER TO postgres;


CREATE TABLE public.test (
    -- Test identifier --
    config_name text,
    test_name text,
    sub_test_index integer,

    -- CPU stats --
    cpu_system_min double precision,
    cpu_system_max double precision,
    cpu_system_avg double precision,
    cpu_user_min double precision,
    cpu_user_max double precision,
    cpu_user_avg double precision,

    -- Kernel stats --
    kernel_context_switches integer,
    kernel_context_switches_per_second double precision,
    kernel_interrupts integer,
    kernel_processes_forked integer,

    -- Memory Stats --
    memory_available_min double precision,
    memory_available_max double precision,
    memory_available_avg double precision,
    memory_available_percent_min double precision,
    memory_available_percent_max double precision,
    memory_available_percent_avg double precision,
    memory_free_min double precision,
    memory_free_max double precision,
    memory_free_avg double precision,
    memory_used_min double precision,
    memory_used_max double precision,
    memory_used_avg double precision,
    memory_used_percent_min double precision,
    memory_used_percent_max double precision,
    memory_used_percent_avg double precision,

    -- Apache Connect --
    connect_connect_min integer,
    connect_connect_mean integer,
    connect_connect_sd integer,
    connect_connect_median integer,
    connect_connect_max integer,
    connect_processing_min integer,
    connect_processing_mean integer,
    connect_processing_sd integer,
    connect_processing_median integer,
    connect_processing_max integer,
    connect_waiting_min integer,
    connect_waiting_mean integer,
    connect_waiting_sd integer,
    connect_waiting_median integer,
    connect_waiting_max integer,
    connect_total_min integer,
    connect_total_mean integer,
    connect_total_sd integer,
    connect_total_median integer,
    connect_total_max integer,

    -- Apache Data --
    data_total text,
    data_transfer_rate text,

    -- Apache Requests --
    requests_completed integer,
    requests_duration integer,
    requests_failed integer,
    requests_non_2xx integer,
    requests_per_second integer,
    requests_time_per integer
);

ALTER TABLE public.test OWNER TO postgres;
