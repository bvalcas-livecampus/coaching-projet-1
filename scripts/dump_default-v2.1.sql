--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: belong_to; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.belong_to (
    id integer NOT NULL,
    player_id integer NOT NULL,
    character_id integer NOT NULL
);


ALTER TABLE public.belong_to OWNER TO postgres;

--
-- Name: belong_to_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.belong_to_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.belong_to_id_seq OWNER TO postgres;

--
-- Name: belong_to_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.belong_to_id_seq OWNED BY public.belong_to.id;


--
-- Name: can_be; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.can_be (
    id integer NOT NULL,
    role_id integer NOT NULL,
    class_id integer NOT NULL
);


ALTER TABLE public.can_be OWNER TO postgres;

--
-- Name: can_be_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.can_be_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.can_be_id_seq OWNER TO postgres;

--
-- Name: can_be_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.can_be_id_seq OWNED BY public.can_be.id;


--
-- Name: characters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.characters (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    class_id integer NOT NULL,
    role_id integer NOT NULL,
    ilvl integer,
    rio integer,
    CONSTRAINT characters_ilvl_check CHECK (((ilvl >= 0) AND (ilvl <= 645))),
    CONSTRAINT characters_rio_check CHECK (((rio >= 0) AND (rio <= 4500)))
);


ALTER TABLE public.characters OWNER TO postgres;

--
-- Name: characters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.characters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.characters_id_seq OWNER TO postgres;

--
-- Name: characters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.characters_id_seq OWNED BY public.characters.id;


--
-- Name: class; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.class (
    id integer NOT NULL,
    identifier character varying(50) NOT NULL,
    label_fr character varying(255) NOT NULL,
    label_en character varying(255) NOT NULL
);


ALTER TABLE public.class OWNER TO postgres;

--
-- Name: class_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.class_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.class_id_seq OWNER TO postgres;

--
-- Name: class_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.class_id_seq OWNED BY public.class.id;


--
-- Name: compose; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compose (
    id integer NOT NULL,
    character_id integer NOT NULL,
    party_id integer NOT NULL
);


ALTER TABLE public.compose OWNER TO postgres;

--
-- Name: compose_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.compose_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compose_id_seq OWNER TO postgres;

--
-- Name: compose_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.compose_id_seq OWNED BY public.compose.id;


--
-- Name: donjon_done; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.donjon_done (
    id integer NOT NULL,
    party_id integer NOT NULL,
    donjon_id integer NOT NULL,
    timer integer NOT NULL
);


ALTER TABLE public.donjon_done OWNER TO postgres;

--
-- Name: donjon_done_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.donjon_done_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.donjon_done_id_seq OWNER TO postgres;

--
-- Name: donjon_done_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.donjon_done_id_seq OWNED BY public.donjon_done.id;


--
-- Name: donjons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.donjons (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    timer integer NOT NULL
);


ALTER TABLE public.donjons OWNER TO postgres;

--
-- Name: donjons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.donjons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.donjons_id_seq OWNER TO postgres;

--
-- Name: donjons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.donjons_id_seq OWNED BY public.donjons.id;


--
-- Name: parties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parties (
    id integer NOT NULL,
    captain_id integer NOT NULL,
    registered_id integer NOT NULL,
    name character varying(255) NOT NULL,
    deleted boolean DEFAULT false
);


ALTER TABLE public.parties OWNER TO postgres;

--
-- Name: parties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.parties_id_seq OWNER TO postgres;

--
-- Name: parties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parties_id_seq OWNED BY public.parties.id;


--
-- Name: players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.players (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.players OWNER TO postgres;

--
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.players_id_seq OWNER TO postgres;

--
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- Name: registered; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registered (
    id integer NOT NULL,
    registration_date timestamp without time zone NOT NULL,
    tournament_id integer NOT NULL
);


ALTER TABLE public.registered OWNER TO postgres;

--
-- Name: registered_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registered_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registered_id_seq OWNER TO postgres;

--
-- Name: registered_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registered_id_seq OWNED BY public.registered.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id integer NOT NULL,
    label character varying(255) NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_id_seq OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: tournament; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tournament (
    id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    name character varying(255) NOT NULL,
    cost_to_registry integer NOT NULL,
    description character varying(255) NOT NULL,
    deleted boolean DEFAULT false
);


ALTER TABLE public.tournament OWNER TO postgres;

--
-- Name: tournament_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tournament_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tournament_id_seq OWNER TO postgres;

--
-- Name: tournament_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tournament_id_seq OWNED BY public.tournament.id;


--
-- Name: belong_to id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.belong_to ALTER COLUMN id SET DEFAULT nextval('public.belong_to_id_seq'::regclass);


--
-- Name: can_be id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.can_be ALTER COLUMN id SET DEFAULT nextval('public.can_be_id_seq'::regclass);


--
-- Name: characters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters ALTER COLUMN id SET DEFAULT nextval('public.characters_id_seq'::regclass);


--
-- Name: class id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class ALTER COLUMN id SET DEFAULT nextval('public.class_id_seq'::regclass);


--
-- Name: compose id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compose ALTER COLUMN id SET DEFAULT nextval('public.compose_id_seq'::regclass);


--
-- Name: donjon_done id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donjon_done ALTER COLUMN id SET DEFAULT nextval('public.donjon_done_id_seq'::regclass);


--
-- Name: donjons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donjons ALTER COLUMN id SET DEFAULT nextval('public.donjons_id_seq'::regclass);


--
-- Name: parties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parties ALTER COLUMN id SET DEFAULT nextval('public.parties_id_seq'::regclass);


--
-- Name: players id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);


--
-- Name: registered id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registered ALTER COLUMN id SET DEFAULT nextval('public.registered_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: tournament id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament ALTER COLUMN id SET DEFAULT nextval('public.tournament_id_seq'::regclass);


--
-- Data for Name: belong_to; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.belong_to (id, player_id, character_id) FROM stdin;
1	1	1
2	4	2
3	5	3
4	2	4
5	3	5
\.


--
-- Data for Name: can_be; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.can_be (id, role_id, class_id) FROM stdin;
1	1	1
2	2	1
3	1	2
4	2	2
5	3	2
6	2	3
7	2	4
8	2	5
9	3	5
10	2	6
11	3	6
12	2	7
13	2	8
14	2	9
15	1	10
16	2	10
17	3	10
18	1	11
19	2	11
20	1	12
21	2	12
22	2	13
23	3	13
\.


--
-- Data for Name: characters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.characters (id, name, class_id, role_id, ilvl, rio) FROM stdin;
1	Thunderfury	1	1	630	3200
2	Lightbringer	2	2	625	3100
3	Shadowstrike	4	2	635	3400
4	Naturewarden	6	2	640	3800
5	Arrowmaster	3	2	628	3300
\.


--
-- Data for Name: class; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class (id, identifier, label_fr, label_en) FROM stdin;
1	warrior	Guerrier	Warrior
2	paladin	Paladin	Paladin
3	hunter	Chasseur	Hunter
4	rogue	Voleur	Rogue
5	priest	Prêtre	Priest
6	shaman	Chaman	Shaman
7	mage	Mage	Mage
8	warlock	Démoniste	Warlock
9	monk	Moine	Monk
10	druid	Druide	Druid
11	dh	Chasseur de démon	Demon Hunter
12	dk	Chevalier de la mort	Death Knight
13	evoker	Évocateur	Evoker
\.


--
-- Data for Name: compose; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compose (id, character_id, party_id) FROM stdin;
1	1	1
2	2	1
3	3	1
4	2	2
5	4	2
6	5	2
7	3	3
8	4	3
9	4	4
10	5	4
11	5	5
\.


--
-- Data for Name: donjon_done; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.donjon_done (id, party_id, donjon_id, timer) FROM stdin;
\.


--
-- Data for Name: donjons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.donjons (id, name, timer) FROM stdin;
1	The Stonevault	33
2	The Dawnbreaker	35
3	Ara-Kara, City of Echoes	30
4	City of Threads	38
5	Mists of Tirna Scithe	30
6	The Necrotic Wake	36
7	Siege of Boralus	36
8	Grim Batol	34
\.


--
-- Data for Name: parties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parties (id, captain_id, registered_id, name, deleted) FROM stdin;
1	1	1	Thunderfury's Champions	f
2	2	2	Light Brigade	f
3	3	3	Shadow Raiders	f
4	4	4	Nature's Guardians	f
5	5	5	Arrow Squad	f
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players (id, username, email, password) FROM stdin;
1	DragonSlayer	dragon.slayer@gmail.com	hashedpass123
2	MythicRunner	mythic.runner@yahoo.com	securepass456
3	LegendaryTank	legendary.tank@hotmail.com	tankpass789
4	HealerPro	healer.pro@gmail.com	healpass321
5	DPSMaster	dps.master@outlook.com	dpspass654
\.


--
-- Data for Name: registered; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registered (id, registration_date, tournament_id) FROM stdin;
1	2024-03-15 10:30:00	1
2	2024-03-20 15:45:00	1
3	2024-06-01 09:00:00	2
4	2024-06-10 14:20:00	2
5	2024-08-15 11:00:00	3
6	2024-12-01 08:30:00	4
7	2024-12-15 16:15:00	4
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (id, label) FROM stdin;
1	tank
2	damage
3	healer
\.


--
-- Data for Name: tournament; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tournament (id, start_date, end_date, name, cost_to_registry, description, deleted) FROM stdin;
1	2024-04-01	2024-04-03	Spring Championship	50	A 3-day competitive tournament featuring the best teams of the season	f
2	2024-06-15	2024-06-16	Summer Weekend Clash	25	An intense weekend of mythic dungeon racing	f
3	2024-08-30	2024-09-02	Labor Day Marathon	75	Extended holiday weekend tournament with increased prize pool	f
4	2024-12-27	2024-12-31	New Year's Challenge	100	End the year with the most prestigious tournament of the season	t
5	2025-12-02	2026-01-02	New Year's Challenge	23	End the year with the most prestigious tournament of the season	f
\.


--
-- Name: belong_to_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.belong_to_id_seq', 5, true);


--
-- Name: can_be_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.can_be_id_seq', 23, true);


--
-- Name: characters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.characters_id_seq', 5, true);


--
-- Name: class_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.class_id_seq', 13, true);


--
-- Name: compose_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compose_id_seq', 11, true);


--
-- Name: donjon_done_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.donjon_done_id_seq', 1, false);


--
-- Name: donjons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.donjons_id_seq', 8, true);


--
-- Name: parties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parties_id_seq', 5, true);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.players_id_seq', 5, true);


--
-- Name: registered_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registered_id_seq', 7, true);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 3, true);


--
-- Name: tournament_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tournament_id_seq', 5, true);


--
-- Name: belong_to belong_to_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.belong_to
    ADD CONSTRAINT belong_to_pkey PRIMARY KEY (player_id, character_id);


--
-- Name: can_be can_be_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.can_be
    ADD CONSTRAINT can_be_pkey PRIMARY KEY (role_id, class_id);


--
-- Name: characters characters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (id);


--
-- Name: class class_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_pkey PRIMARY KEY (id);


--
-- Name: compose compose_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compose
    ADD CONSTRAINT compose_pkey PRIMARY KEY (character_id, party_id);


--
-- Name: donjon_done donjon_done_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donjon_done
    ADD CONSTRAINT donjon_done_pkey PRIMARY KEY (party_id, donjon_id);


--
-- Name: donjons donjons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donjons
    ADD CONSTRAINT donjons_pkey PRIMARY KEY (id);


--
-- Name: parties parties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parties
    ADD CONSTRAINT parties_pkey PRIMARY KEY (id);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: registered registered_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registered
    ADD CONSTRAINT registered_pkey PRIMARY KEY (id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: tournament tournament_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament
    ADD CONSTRAINT tournament_pkey PRIMARY KEY (id);


--
-- Name: belong_to belong_to_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.belong_to
    ADD CONSTRAINT belong_to_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id);


--
-- Name: belong_to belong_to_character_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.belong_to
    ADD CONSTRAINT belong_to_character_id_fkey1 FOREIGN KEY (character_id) REFERENCES public.characters(id);


--
-- Name: belong_to belong_to_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.belong_to
    ADD CONSTRAINT belong_to_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: belong_to belong_to_player_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.belong_to
    ADD CONSTRAINT belong_to_player_id_fkey1 FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: can_be can_be_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.can_be
    ADD CONSTRAINT can_be_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.class(id);


--
-- Name: can_be can_be_class_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.can_be
    ADD CONSTRAINT can_be_class_id_fkey1 FOREIGN KEY (class_id) REFERENCES public.class(id);


--
-- Name: can_be can_be_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.can_be
    ADD CONSTRAINT can_be_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: can_be can_be_role_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.can_be
    ADD CONSTRAINT can_be_role_id_fkey1 FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: characters characters_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.class(id);


--
-- Name: characters characters_role_id_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_role_id_class_id_fkey FOREIGN KEY (role_id, class_id) REFERENCES public.can_be(role_id, class_id);


--
-- Name: characters characters_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: compose compose_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compose
    ADD CONSTRAINT compose_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id);


--
-- Name: compose compose_character_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compose
    ADD CONSTRAINT compose_character_id_fkey1 FOREIGN KEY (character_id) REFERENCES public.characters(id);


--
-- Name: compose compose_party_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compose
    ADD CONSTRAINT compose_party_id_fkey FOREIGN KEY (party_id) REFERENCES public.parties(id);


--
-- Name: compose compose_party_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compose
    ADD CONSTRAINT compose_party_id_fkey1 FOREIGN KEY (party_id) REFERENCES public.parties(id);


--
-- Name: donjon_done donjon_done_donjon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donjon_done
    ADD CONSTRAINT donjon_done_donjon_id_fkey FOREIGN KEY (donjon_id) REFERENCES public.donjons(id);


--
-- Name: donjon_done donjon_done_donjon_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donjon_done
    ADD CONSTRAINT donjon_done_donjon_id_fkey1 FOREIGN KEY (donjon_id) REFERENCES public.donjons(id);


--
-- Name: donjon_done donjon_done_party_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donjon_done
    ADD CONSTRAINT donjon_done_party_id_fkey FOREIGN KEY (party_id) REFERENCES public.parties(id);


--
-- Name: donjon_done donjon_done_party_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donjon_done
    ADD CONSTRAINT donjon_done_party_id_fkey1 FOREIGN KEY (party_id) REFERENCES public.parties(id);


--
-- Name: parties parties_captain_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parties
    ADD CONSTRAINT parties_captain_id_fkey FOREIGN KEY (captain_id) REFERENCES public.characters(id);


--
-- Name: parties parties_captain_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parties
    ADD CONSTRAINT parties_captain_id_fkey1 FOREIGN KEY (captain_id) REFERENCES public.characters(id);


--
-- Name: parties parties_registered_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parties
    ADD CONSTRAINT parties_registered_id_fkey FOREIGN KEY (registered_id) REFERENCES public.registered(id);


--
-- Name: parties parties_registered_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parties
    ADD CONSTRAINT parties_registered_id_fkey1 FOREIGN KEY (registered_id) REFERENCES public.registered(id);


--
-- Name: registered registered_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registered
    ADD CONSTRAINT registered_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournament(id);


--
-- Name: registered registered_tournament_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registered
    ADD CONSTRAINT registered_tournament_id_fkey1 FOREIGN KEY (tournament_id) REFERENCES public.tournament(id);


--
-- PostgreSQL database dump complete
--

