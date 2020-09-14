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
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: docker_build; Type: TABLE; Schema: public; Owner: postgres
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