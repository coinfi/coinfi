SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: dblink; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dblink WITH SCHEMA public;


--
-- Name: EXTENSION dblink; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION dblink IS 'connect to other PostgreSQL databases from within a database';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.articles (
    id bigint NOT NULL,
    coin_id bigint,
    url character varying,
    title character varying,
    summary text,
    published_date timestamp without time zone,
    published_epoch bigint,
    importance numeric,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.articles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- Name: author_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.author_profiles (
    id bigint NOT NULL,
    user_id bigint,
    name character varying,
    company character varying,
    role character varying,
    website_url character varying,
    twitter_url character varying,
    linkedin_url character varying,
    photo character varying,
    bio text,
    investing_style character varying,
    slug character varying
);


--
-- Name: author_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.author_profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: author_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.author_profiles_id_seq OWNED BY public.author_profiles.id;


--
-- Name: blazer_audits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blazer_audits (
    id bigint NOT NULL,
    user_id bigint,
    query_id bigint,
    statement text,
    data_source character varying,
    created_at timestamp without time zone
);


--
-- Name: blazer_audits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blazer_audits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blazer_audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blazer_audits_id_seq OWNED BY public.blazer_audits.id;


--
-- Name: blazer_checks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blazer_checks (
    id bigint NOT NULL,
    creator_id bigint,
    query_id bigint,
    state character varying,
    schedule character varying,
    emails text,
    check_type character varying,
    message text,
    last_run_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: blazer_checks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blazer_checks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blazer_checks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blazer_checks_id_seq OWNED BY public.blazer_checks.id;


--
-- Name: blazer_dashboard_queries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blazer_dashboard_queries (
    id bigint NOT NULL,
    dashboard_id bigint,
    query_id bigint,
    "position" integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: blazer_dashboard_queries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blazer_dashboard_queries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blazer_dashboard_queries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blazer_dashboard_queries_id_seq OWNED BY public.blazer_dashboard_queries.id;


--
-- Name: blazer_dashboards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blazer_dashboards (
    id bigint NOT NULL,
    creator_id bigint,
    name text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: blazer_dashboards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blazer_dashboards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blazer_dashboards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blazer_dashboards_id_seq OWNED BY public.blazer_dashboards.id;


--
-- Name: blazer_queries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blazer_queries (
    id bigint NOT NULL,
    creator_id bigint,
    name character varying,
    description text,
    statement text,
    data_source character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: blazer_queries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blazer_queries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blazer_queries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blazer_queries_id_seq OWNED BY public.blazer_queries.id;


--
-- Name: calendar_event_categorizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendar_event_categorizations (
    id bigint NOT NULL,
    calendar_event_id bigint,
    news_category_id bigint
);


--
-- Name: calendar_event_categorizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.calendar_event_categorizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: calendar_event_categorizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.calendar_event_categorizations_id_seq OWNED BY public.calendar_event_categorizations.id;


--
-- Name: calendar_event_coins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendar_event_coins (
    id bigint NOT NULL,
    calendar_event_id bigint,
    coin_id bigint
);


--
-- Name: calendar_event_coins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.calendar_event_coins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: calendar_event_coins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.calendar_event_coins_id_seq OWNED BY public.calendar_event_coins.id;


--
-- Name: calendar_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendar_events (
    id bigint NOT NULL,
    user_id bigint,
    name character varying,
    description text,
    date_event timestamp without time zone,
    date_added timestamp without time zone,
    source_url character varying,
    screenshot_url character varying,
    status character varying,
    approvals bigint,
    disapprovals bigint,
    confidence integer,
    import_id bigint
);


--
-- Name: calendar_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.calendar_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: calendar_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.calendar_events_id_seq OWNED BY public.calendar_events.id;


--
-- Name: coin_excluded_countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coin_excluded_countries (
    id bigint NOT NULL,
    coin_id bigint,
    country_id bigint,
    notes text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: coin_excluded_countries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coin_excluded_countries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coin_excluded_countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coin_excluded_countries_id_seq OWNED BY public.coin_excluded_countries.id;


--
-- Name: coin_industries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coin_industries (
    id bigint NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: coin_industries_coins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coin_industries_coins (
    coin_id bigint NOT NULL,
    coin_industry_id bigint NOT NULL,
    id bigint NOT NULL
);


--
-- Name: coin_industries_coins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coin_industries_coins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coin_industries_coins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coin_industries_coins_id_seq OWNED BY public.coin_industries_coins.id;


--
-- Name: coin_industries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coin_industries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coin_industries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coin_industries_id_seq OWNED BY public.coin_industries.id;


--
-- Name: coins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coins (
    id bigint NOT NULL,
    name character varying NOT NULL,
    symbol character varying,
    slug character varying,
    category character varying,
    market_cap jsonb,
    price jsonb,
    volume24 jsonb,
    change1h numeric,
    change24h numeric,
    change7d numeric,
    available_supply bigint,
    max_supply bigint,
    website character varying,
    website2 character varying,
    explorer character varying,
    explorer2 character varying,
    forum character varying,
    forum2 character varying,
    twitter character varying,
    reddit character varying,
    medium character varying,
    github character varying,
    whitepaper character varying,
    release_date date,
    algorithm character varying,
    proof_type character varying,
    image_url character varying,
    is_premined boolean,
    tier integer,
    ranking integer,
    last_synced integer,
    intro text,
    summary text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    ico_status character varying,
    ico_usd_raised bigint,
    ico_start_epoch bigint,
    ico_end_epoch bigint,
    ico_token_price_usd numeric(24,16),
    ico_token_price_btc numeric(24,16),
    ico_token_price_eth numeric(24,16),
    ico_personal_cap_min character varying,
    ico_personal_cap_max character varying,
    ico_fundraising_goal_usd numeric(18,2),
    ico_fundraising_goal_eth numeric(24,16),
    ico_fundraising_status_usd numeric(18,2),
    ico_fundraising_status_eth numeric(24,16),
    ico_tokens_sold numeric(32,16),
    ico_returns_usd double precision,
    ico_returns_btc double precision,
    ico_returns_eth double precision,
    blockchain_tech character varying,
    token_type character varying,
    exchanges jsonb[],
    previous_name character varying,
    influencer_reviews_count integer,
    ico_start_date timestamp without time zone,
    ico_end_date timestamp without time zone,
    coin_key character varying,
    is_listed boolean,
    external_url jsonb,
    eth_address character varying,
    country character varying,
    share_of_tokens_for_sale double precision,
    external_key jsonb,
    facebook character varying,
    telegram character varying,
    total_supply numeric(32,2),
    description text,
    team jsonb,
    external_rating jsonb,
    token_decimals integer,
    cmc_id integer
);


--
-- Name: coins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coins_id_seq OWNED BY public.coins.id;


--
-- Name: contributor_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contributor_submissions (
    id bigint NOT NULL,
    user_id bigint,
    title character varying,
    summary text,
    content text,
    submission_category_id bigint,
    status integer DEFAULT 0 NOT NULL,
    disclosure text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: contributor_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contributor_submissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contributor_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contributor_submissions_id_seq OWNED BY public.contributor_submissions.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.countries (
    id bigint NOT NULL,
    name character varying,
    alpha2 character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.countries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: exchange_listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exchange_listings (
    id bigint NOT NULL,
    exchange_id bigint,
    ccxt_exchange_id character varying,
    symbol character varying,
    quote_symbol character varying,
    quote_symbol_id bigint,
    base_symbol character varying,
    base_symbol_id bigint,
    detected_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: exchange_listings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.exchange_listings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: exchange_listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.exchange_listings_id_seq OWNED BY public.exchange_listings.id;


--
-- Name: metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.metrics (
    id bigint NOT NULL,
    token_address character varying(66),
    metric_type character varying(256),
    date date,
    metric_value double precision
);


--
-- Name: exchange_supply_view; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.exchange_supply_view AS
 SELECT rank() OVER (ORDER BY metrics_after.metric_value DESC) AS rank,
    sum(1) OVER () AS num_coins,
    (metrics_after.metric_value * (100.0)::double precision) AS metric_value,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_1d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_1d,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_7d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_7d,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_30d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_30d,
    coins.coin_key
   FROM ((((public.metrics metrics_after
     JOIN public.coins ON (((metrics_after.token_address)::text = (coins.eth_address)::text)))
     JOIN public.metrics metrics_1d_before ON ((((metrics_1d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_1d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_1d_before.date) = 1))))
     JOIN public.metrics metrics_7d_before ON ((((metrics_7d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_7d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_7d_before.date) = 7))))
     JOIN public.metrics metrics_30d_before ON ((((metrics_30d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_30d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_30d_before.date) = 30))))
  WHERE (((metrics_after.metric_type)::text = 'exchange_supply'::text) AND (metrics_after.date = ( SELECT max(metrics.date) AS max
           FROM public.metrics)))
  WITH NO DATA;


--
-- Name: exchanges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exchanges (
    id bigint NOT NULL,
    ccxt_id character varying,
    name character varying,
    slug character varying,
    www_url character varying,
    logo_url character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: exchanges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.exchanges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: exchanges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.exchanges_id_seq OWNED BY public.exchanges.id;


--
-- Name: feed_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feed_sources (
    id bigint NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    feed_url character varying NOT NULL,
    site_hostname character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    feed_type character varying,
    is_subscribed boolean DEFAULT false,
    last_received_data_at timestamp without time zone,
    coin_id bigint,
    is_active boolean DEFAULT true
);


--
-- Name: feed_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feed_sources_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feed_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feed_sources_id_seq OWNED BY public.feed_sources.id;


--
-- Name: friendly_id_slugs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.friendly_id_slugs (
    id bigint NOT NULL,
    slug character varying NOT NULL,
    sluggable_id integer NOT NULL,
    sluggable_type character varying(50),
    scope character varying,
    created_at timestamp without time zone
);


--
-- Name: friendly_id_slugs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.friendly_id_slugs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: friendly_id_slugs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.friendly_id_slugs_id_seq OWNED BY public.friendly_id_slugs.id;


--
-- Name: influencer_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.influencer_reviews (
    id bigint NOT NULL,
    coin_id bigint,
    influencer_id bigint,
    url character varying,
    rating character varying,
    review text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    review_date timestamp without time zone
);


--
-- Name: influencer_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.influencer_reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: influencer_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.influencer_reviews_id_seq OWNED BY public.influencer_reviews.id;


--
-- Name: influencers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.influencers (
    id bigint NOT NULL,
    name character varying,
    website character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: influencers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.influencers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: influencers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.influencers_id_seq OWNED BY public.influencers.id;


--
-- Name: market_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.market_metrics (
    id bigint NOT NULL,
    total_market_cap numeric(18,2) NOT NULL,
    total_volume_24h numeric(18,2),
    "timestamp" timestamp without time zone NOT NULL
);


--
-- Name: market_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.market_metrics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: market_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.market_metrics_id_seq OWNED BY public.market_metrics.id;


--
-- Name: metrics_chart_view; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.metrics_chart_view AS
 SELECT (avg(metrics.metric_value) * (100.0)::double precision) AS percentage,
    metrics.date,
    coins.coin_key,
    metrics.metric_type,
    avg(metrics.metric_value) AS number
   FROM (public.metrics
     JOIN public.coins ON (((metrics.token_address)::text = (coins.eth_address)::text)))
  GROUP BY metrics.date, metrics.metric_type, coins.coin_key
  ORDER BY metrics.date
  WITH NO DATA;


--
-- Name: metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.metrics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.metrics_id_seq OWNED BY public.metrics.id;


--
-- Name: news_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_categories (
    id bigint NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: news_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_categories_id_seq OWNED BY public.news_categories.id;


--
-- Name: news_coin_mentions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_coin_mentions (
    id bigint NOT NULL,
    coin_id bigint,
    news_item_id bigint,
    is_machine_tagged boolean DEFAULT false
);


--
-- Name: news_coin_mentions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_coin_mentions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_coin_mentions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_coin_mentions_id_seq OWNED BY public.news_coin_mentions.id;


--
-- Name: news_item_categorizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_item_categorizations (
    id bigint NOT NULL,
    news_item_id bigint,
    news_category_id bigint
);


--
-- Name: news_item_categorizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_item_categorizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_item_categorizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_item_categorizations_id_seq OWNED BY public.news_item_categorizations.id;


--
-- Name: news_item_raws; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_item_raws (
    id bigint NOT NULL,
    feed_item_id character varying,
    source character varying,
    websub_hub character varying,
    feed_item_json jsonb,
    is_processed boolean DEFAULT false,
    news_item_id integer,
    was_replaced_by_an_update boolean
);


--
-- Name: news_item_raws_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_item_raws_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_item_raws_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_item_raws_id_seq OWNED BY public.news_item_raws.id;


--
-- Name: news_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_items (
    id bigint NOT NULL,
    feed_source_id bigint NOT NULL,
    feed_item_id character varying NOT NULL,
    url character varying NOT NULL,
    title character varying NOT NULL,
    summary text,
    content text,
    actor_id character varying,
    feed_item_published_at timestamp without time zone NOT NULL,
    feed_item_updated_at timestamp without time zone NOT NULL,
    feed_item_json jsonb,
    websub_hub character varying,
    importance integer DEFAULT 0,
    is_published boolean DEFAULT true,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    is_human_tagged boolean,
    last_human_tagged_on timestamp without time zone,
    last_machine_tagged_on timestamp without time zone,
    user_id bigint,
    coin_ids jsonb
);


--
-- Name: news_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_items_id_seq OWNED BY public.news_items.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: signals_telegram_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.signals_telegram_subscriptions (
    id bigint NOT NULL,
    signals_telegram_user_id bigint,
    coin_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: signals_telegram_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.signals_telegram_subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: signals_telegram_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.signals_telegram_subscriptions_id_seq OWNED BY public.signals_telegram_subscriptions.id;


--
-- Name: signals_telegram_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.signals_telegram_users (
    id bigint NOT NULL,
    user_id bigint,
    telegram_username character varying,
    telegram_chat_id character varying,
    started_at timestamp without time zone,
    is_active boolean,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    telegram_id character varying
);


--
-- Name: signals_telegram_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.signals_telegram_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: signals_telegram_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.signals_telegram_users_id_seq OWNED BY public.signals_telegram_users.id;


--
-- Name: staked_cofi_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staked_cofi_transactions (
    id bigint NOT NULL,
    user_id bigint,
    txn_block_number character varying,
    txn_timestamp timestamp without time zone,
    txn_hash character varying,
    txn_block_hash character varying,
    txn_from character varying,
    txn_to character varying,
    txn_value character varying,
    txn_token_decimal integer,
    is_txn_confirmations_gte_10 boolean,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: staked_cofi_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.staked_cofi_transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: staked_cofi_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.staked_cofi_transactions_id_seq OWNED BY public.staked_cofi_transactions.id;


--
-- Name: submission_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.submission_categories (
    id bigint NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: submission_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.submission_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: submission_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.submission_categories_id_seq OWNED BY public.submission_categories.id;


--
-- Name: taggings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.taggings (
    id integer NOT NULL,
    tag_id integer,
    taggable_type character varying,
    taggable_id integer,
    tagger_type character varying,
    tagger_id integer,
    context character varying(128),
    created_at timestamp without time zone
);


--
-- Name: taggings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.taggings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: taggings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.taggings_id_seq OWNED BY public.taggings.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying,
    taggings_count integer DEFAULT 0
);


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: token_distribution_100_view; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.token_distribution_100_view AS
 SELECT rank() OVER (ORDER BY metrics_after.metric_value) AS rank,
    sum(1) OVER () AS num_coins,
    (metrics_after.metric_value * (100.0)::double precision) AS metric_value,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_1d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_1d,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_7d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_7d,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_30d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_30d,
    coins.coin_key
   FROM ((((public.metrics metrics_after
     JOIN public.coins ON (((metrics_after.token_address)::text = (coins.eth_address)::text)))
     JOIN public.metrics metrics_1d_before ON ((((metrics_1d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_1d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_1d_before.date) = 1))))
     JOIN public.metrics metrics_7d_before ON ((((metrics_7d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_7d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_7d_before.date) = 7))))
     JOIN public.metrics metrics_30d_before ON ((((metrics_30d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_30d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_30d_before.date) = 30))))
  WHERE (((metrics_after.metric_type)::text = 'token_distribution_100'::text) AND (metrics_after.date = ( SELECT max(metrics.date) AS max
           FROM public.metrics)))
  WITH NO DATA;


--
-- Name: token_retention_rate_view; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.token_retention_rate_view AS
 SELECT rank() OVER (ORDER BY metrics_after.metric_value DESC) AS rank,
    sum(1) OVER () AS num_coins,
    (metrics_after.metric_value * (100.0)::double precision) AS metric_value,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_1d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_1d,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_7d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_7d,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_30d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_30d,
    coins.coin_key
   FROM ((((public.metrics metrics_after
     JOIN public.coins ON (((metrics_after.token_address)::text = (coins.eth_address)::text)))
     JOIN public.metrics metrics_1d_before ON ((((metrics_1d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_1d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_1d_before.date) = 1))))
     JOIN public.metrics metrics_7d_before ON ((((metrics_7d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_7d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_7d_before.date) = 7))))
     JOIN public.metrics metrics_30d_before ON ((((metrics_30d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_30d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_30d_before.date) = 30))))
  WHERE (((metrics_after.metric_type)::text = 'token_retention_rate'::text) AND (metrics_after.date = ( SELECT max(metrics.date) AS max
           FROM public.metrics)))
  WITH NO DATA;


--
-- Name: token_velocity_view; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.token_velocity_view AS
 SELECT rank() OVER (ORDER BY metrics_after.metric_value DESC) AS rank,
    sum(1) OVER () AS num_coins,
    (metrics_after.metric_value * (100.0)::double precision) AS metric_value,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_1d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_1d,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_7d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_7d,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_30d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_30d,
    coins.coin_key
   FROM ((((public.metrics metrics_after
     JOIN public.coins ON (((metrics_after.token_address)::text = (coins.eth_address)::text)))
     JOIN public.metrics metrics_1d_before ON ((((metrics_1d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_1d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_1d_before.date) = 1))))
     JOIN public.metrics metrics_7d_before ON ((((metrics_7d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_7d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_7d_before.date) = 7))))
     JOIN public.metrics metrics_30d_before ON ((((metrics_30d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_30d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_30d_before.date) = 30))))
  WHERE (((metrics_after.metric_type)::text = 'exchange_supply'::text) AND (metrics_after.date = ( SELECT max(metrics.date) AS max
           FROM public.metrics)))
  WITH NO DATA;


--
-- Name: trading_signal_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trading_signal_notifications (
    id bigint NOT NULL,
    external_id character varying,
    trading_signal_id bigint,
    trading_signal_external_id character varying,
    user_id bigint,
    extra jsonb,
    "timestamp" timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: trading_signal_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trading_signal_notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trading_signal_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trading_signal_notifications_id_seq OWNED BY public.trading_signal_notifications.id;


--
-- Name: trading_signal_triggers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trading_signal_triggers (
    id bigint NOT NULL,
    external_id character varying,
    type_key character varying,
    params jsonb,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: trading_signal_triggers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trading_signal_triggers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trading_signal_triggers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trading_signal_triggers_id_seq OWNED BY public.trading_signal_triggers.id;


--
-- Name: trading_signals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trading_signals (
    id bigint NOT NULL,
    external_id character varying,
    trading_signal_trigger_id bigint,
    trading_signal_trigger_external_id character varying,
    extra jsonb,
    "timestamp" timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: trading_signals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trading_signals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trading_signals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trading_signals_id_seq OWNED BY public.trading_signals.id;


--
-- Name: unique_wallet_count_view; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.unique_wallet_count_view AS
 SELECT rank() OVER (ORDER BY metrics_after.metric_value DESC) AS rank,
    sum(1) OVER () AS num_coins,
    metrics_after.metric_value,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_1d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_1d,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_7d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_7d,
    COALESCE(((100.0)::double precision * ((metrics_after.metric_value / NULLIF(metrics_30d_before.metric_value, (0)::double precision)) - (1)::double precision)), (0.0)::double precision) AS change_30d,
    coins.coin_key
   FROM ((((public.metrics metrics_after
     JOIN public.coins ON (((metrics_after.token_address)::text = (coins.eth_address)::text)))
     JOIN public.metrics metrics_1d_before ON ((((metrics_1d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_1d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_1d_before.date) = 1))))
     JOIN public.metrics metrics_7d_before ON ((((metrics_7d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_7d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_7d_before.date) = 7))))
     JOIN public.metrics metrics_30d_before ON ((((metrics_30d_before.token_address)::text = (coins.eth_address)::text) AND ((metrics_30d_before.metric_type)::text = (metrics_after.metric_type)::text) AND ((metrics_after.date - metrics_30d_before.date) = 30))))
  WHERE (((metrics_after.metric_type)::text = 'unique_wallet_count'::text) AND (metrics_after.date = ( SELECT max(metrics.date) AS max
           FROM public.metrics)))
  WITH NO DATA;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    sign_in_count integer DEFAULT 0 NOT NULL,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip inet,
    last_sign_in_ip inet,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    provider character varying,
    uid character varying,
    token_sale jsonb,
    username character varying,
    role character varying,
    default_currency character varying
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: watchlist_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.watchlist_items (
    watchlist_id bigint NOT NULL,
    coin_id bigint NOT NULL,
    id bigint NOT NULL,
    "position" integer DEFAULT 0
);


--
-- Name: watchlist_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.watchlist_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: watchlist_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.watchlist_items_id_seq OWNED BY public.watchlist_items.id;


--
-- Name: watchlists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.watchlists (
    id bigint NOT NULL,
    user_id bigint
);


--
-- Name: watchlists_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.watchlists_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: watchlists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.watchlists_id_seq OWNED BY public.watchlists.id;


--
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- Name: author_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_profiles ALTER COLUMN id SET DEFAULT nextval('public.author_profiles_id_seq'::regclass);


--
-- Name: blazer_audits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blazer_audits ALTER COLUMN id SET DEFAULT nextval('public.blazer_audits_id_seq'::regclass);


--
-- Name: blazer_checks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blazer_checks ALTER COLUMN id SET DEFAULT nextval('public.blazer_checks_id_seq'::regclass);


--
-- Name: blazer_dashboard_queries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blazer_dashboard_queries ALTER COLUMN id SET DEFAULT nextval('public.blazer_dashboard_queries_id_seq'::regclass);


--
-- Name: blazer_dashboards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blazer_dashboards ALTER COLUMN id SET DEFAULT nextval('public.blazer_dashboards_id_seq'::regclass);


--
-- Name: blazer_queries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blazer_queries ALTER COLUMN id SET DEFAULT nextval('public.blazer_queries_id_seq'::regclass);


--
-- Name: calendar_event_categorizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_event_categorizations ALTER COLUMN id SET DEFAULT nextval('public.calendar_event_categorizations_id_seq'::regclass);


--
-- Name: calendar_event_coins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_event_coins ALTER COLUMN id SET DEFAULT nextval('public.calendar_event_coins_id_seq'::regclass);


--
-- Name: calendar_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_events ALTER COLUMN id SET DEFAULT nextval('public.calendar_events_id_seq'::regclass);


--
-- Name: coin_excluded_countries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_excluded_countries ALTER COLUMN id SET DEFAULT nextval('public.coin_excluded_countries_id_seq'::regclass);


--
-- Name: coin_industries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_industries ALTER COLUMN id SET DEFAULT nextval('public.coin_industries_id_seq'::regclass);


--
-- Name: coin_industries_coins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_industries_coins ALTER COLUMN id SET DEFAULT nextval('public.coin_industries_coins_id_seq'::regclass);


--
-- Name: coins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coins ALTER COLUMN id SET DEFAULT nextval('public.coins_id_seq'::regclass);


--
-- Name: contributor_submissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contributor_submissions ALTER COLUMN id SET DEFAULT nextval('public.contributor_submissions_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: exchange_listings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exchange_listings ALTER COLUMN id SET DEFAULT nextval('public.exchange_listings_id_seq'::regclass);


--
-- Name: exchanges id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exchanges ALTER COLUMN id SET DEFAULT nextval('public.exchanges_id_seq'::regclass);


--
-- Name: feed_sources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feed_sources ALTER COLUMN id SET DEFAULT nextval('public.feed_sources_id_seq'::regclass);


--
-- Name: friendly_id_slugs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendly_id_slugs ALTER COLUMN id SET DEFAULT nextval('public.friendly_id_slugs_id_seq'::regclass);


--
-- Name: influencer_reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.influencer_reviews ALTER COLUMN id SET DEFAULT nextval('public.influencer_reviews_id_seq'::regclass);


--
-- Name: influencers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.influencers ALTER COLUMN id SET DEFAULT nextval('public.influencers_id_seq'::regclass);


--
-- Name: market_metrics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_metrics ALTER COLUMN id SET DEFAULT nextval('public.market_metrics_id_seq'::regclass);


--
-- Name: metrics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.metrics ALTER COLUMN id SET DEFAULT nextval('public.metrics_id_seq'::regclass);


--
-- Name: news_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_categories ALTER COLUMN id SET DEFAULT nextval('public.news_categories_id_seq'::regclass);


--
-- Name: news_coin_mentions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_coin_mentions ALTER COLUMN id SET DEFAULT nextval('public.news_coin_mentions_id_seq'::regclass);


--
-- Name: news_item_categorizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_item_categorizations ALTER COLUMN id SET DEFAULT nextval('public.news_item_categorizations_id_seq'::regclass);


--
-- Name: news_item_raws id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_item_raws ALTER COLUMN id SET DEFAULT nextval('public.news_item_raws_id_seq'::regclass);


--
-- Name: news_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_items ALTER COLUMN id SET DEFAULT nextval('public.news_items_id_seq'::regclass);


--
-- Name: signals_telegram_subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signals_telegram_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.signals_telegram_subscriptions_id_seq'::regclass);


--
-- Name: signals_telegram_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signals_telegram_users ALTER COLUMN id SET DEFAULT nextval('public.signals_telegram_users_id_seq'::regclass);


--
-- Name: staked_cofi_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staked_cofi_transactions ALTER COLUMN id SET DEFAULT nextval('public.staked_cofi_transactions_id_seq'::regclass);


--
-- Name: submission_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission_categories ALTER COLUMN id SET DEFAULT nextval('public.submission_categories_id_seq'::regclass);


--
-- Name: taggings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taggings ALTER COLUMN id SET DEFAULT nextval('public.taggings_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: trading_signal_notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_signal_notifications ALTER COLUMN id SET DEFAULT nextval('public.trading_signal_notifications_id_seq'::regclass);


--
-- Name: trading_signal_triggers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_signal_triggers ALTER COLUMN id SET DEFAULT nextval('public.trading_signal_triggers_id_seq'::regclass);


--
-- Name: trading_signals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_signals ALTER COLUMN id SET DEFAULT nextval('public.trading_signals_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: watchlist_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlist_items ALTER COLUMN id SET DEFAULT nextval('public.watchlist_items_id_seq'::regclass);


--
-- Name: watchlists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlists ALTER COLUMN id SET DEFAULT nextval('public.watchlists_id_seq'::regclass);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: author_profiles author_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_profiles
    ADD CONSTRAINT author_profiles_pkey PRIMARY KEY (id);


--
-- Name: blazer_audits blazer_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blazer_audits
    ADD CONSTRAINT blazer_audits_pkey PRIMARY KEY (id);


--
-- Name: blazer_checks blazer_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blazer_checks
    ADD CONSTRAINT blazer_checks_pkey PRIMARY KEY (id);


--
-- Name: blazer_dashboard_queries blazer_dashboard_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blazer_dashboard_queries
    ADD CONSTRAINT blazer_dashboard_queries_pkey PRIMARY KEY (id);


--
-- Name: blazer_dashboards blazer_dashboards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blazer_dashboards
    ADD CONSTRAINT blazer_dashboards_pkey PRIMARY KEY (id);


--
-- Name: blazer_queries blazer_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blazer_queries
    ADD CONSTRAINT blazer_queries_pkey PRIMARY KEY (id);


--
-- Name: calendar_event_categorizations calendar_event_categorizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_event_categorizations
    ADD CONSTRAINT calendar_event_categorizations_pkey PRIMARY KEY (id);


--
-- Name: calendar_event_coins calendar_event_coins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_event_coins
    ADD CONSTRAINT calendar_event_coins_pkey PRIMARY KEY (id);


--
-- Name: calendar_events calendar_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_events
    ADD CONSTRAINT calendar_events_pkey PRIMARY KEY (id);


--
-- Name: coin_excluded_countries coin_excluded_countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_excluded_countries
    ADD CONSTRAINT coin_excluded_countries_pkey PRIMARY KEY (id);


--
-- Name: coin_industries_coins coin_industries_coins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_industries_coins
    ADD CONSTRAINT coin_industries_coins_pkey PRIMARY KEY (id);


--
-- Name: coin_industries coin_industries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_industries
    ADD CONSTRAINT coin_industries_pkey PRIMARY KEY (id);


--
-- Name: coins coins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coins
    ADD CONSTRAINT coins_pkey PRIMARY KEY (id);


--
-- Name: metrics composite_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.metrics
    ADD CONSTRAINT composite_key UNIQUE (token_address, metric_type, date);


--
-- Name: contributor_submissions contributor_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contributor_submissions
    ADD CONSTRAINT contributor_submissions_pkey PRIMARY KEY (id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: exchange_listings exchange_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exchange_listings
    ADD CONSTRAINT exchange_listings_pkey PRIMARY KEY (id);


--
-- Name: exchanges exchanges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exchanges
    ADD CONSTRAINT exchanges_pkey PRIMARY KEY (id);


--
-- Name: feed_sources feed_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feed_sources
    ADD CONSTRAINT feed_sources_pkey PRIMARY KEY (id);


--
-- Name: friendly_id_slugs friendly_id_slugs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendly_id_slugs
    ADD CONSTRAINT friendly_id_slugs_pkey PRIMARY KEY (id);


--
-- Name: influencer_reviews influencer_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.influencer_reviews
    ADD CONSTRAINT influencer_reviews_pkey PRIMARY KEY (id);


--
-- Name: influencers influencers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.influencers
    ADD CONSTRAINT influencers_pkey PRIMARY KEY (id);


--
-- Name: market_metrics market_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_metrics
    ADD CONSTRAINT market_metrics_pkey PRIMARY KEY (id);


--
-- Name: metrics metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.metrics
    ADD CONSTRAINT metrics_pkey PRIMARY KEY (id);


--
-- Name: news_categories news_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_categories
    ADD CONSTRAINT news_categories_pkey PRIMARY KEY (id);


--
-- Name: news_coin_mentions news_coin_mentions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_coin_mentions
    ADD CONSTRAINT news_coin_mentions_pkey PRIMARY KEY (id);


--
-- Name: news_item_categorizations news_item_categorizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_item_categorizations
    ADD CONSTRAINT news_item_categorizations_pkey PRIMARY KEY (id);


--
-- Name: news_item_raws news_item_raws_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_item_raws
    ADD CONSTRAINT news_item_raws_pkey PRIMARY KEY (id);


--
-- Name: news_items news_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_items
    ADD CONSTRAINT news_items_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: signals_telegram_subscriptions signals_telegram_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signals_telegram_subscriptions
    ADD CONSTRAINT signals_telegram_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: signals_telegram_users signals_telegram_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signals_telegram_users
    ADD CONSTRAINT signals_telegram_users_pkey PRIMARY KEY (id);


--
-- Name: staked_cofi_transactions staked_cofi_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staked_cofi_transactions
    ADD CONSTRAINT staked_cofi_transactions_pkey PRIMARY KEY (id);


--
-- Name: submission_categories submission_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission_categories
    ADD CONSTRAINT submission_categories_pkey PRIMARY KEY (id);


--
-- Name: taggings taggings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taggings
    ADD CONSTRAINT taggings_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: trading_signal_notifications trading_signal_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_signal_notifications
    ADD CONSTRAINT trading_signal_notifications_pkey PRIMARY KEY (id);


--
-- Name: trading_signal_triggers trading_signal_triggers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_signal_triggers
    ADD CONSTRAINT trading_signal_triggers_pkey PRIMARY KEY (id);


--
-- Name: trading_signals trading_signals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_signals
    ADD CONSTRAINT trading_signals_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: watchlist_items watchlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlist_items
    ADD CONSTRAINT watchlist_items_pkey PRIMARY KEY (id);


--
-- Name: watchlists watchlists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlists
    ADD CONSTRAINT watchlists_pkey PRIMARY KEY (id);


--
-- Name: index_articles_on_coin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_articles_on_coin_id ON public.articles USING btree (coin_id);


--
-- Name: index_author_profiles_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_author_profiles_on_slug ON public.author_profiles USING btree (slug);


--
-- Name: index_author_profiles_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_author_profiles_on_user_id ON public.author_profiles USING btree (user_id);


--
-- Name: index_blazer_audits_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_blazer_audits_on_user_id ON public.blazer_audits USING btree (user_id);


--
-- Name: index_blazer_checks_on_query_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_blazer_checks_on_query_id ON public.blazer_checks USING btree (query_id);


--
-- Name: index_blazer_dashboard_queries_on_query_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_blazer_dashboard_queries_on_query_id ON public.blazer_dashboard_queries USING btree (query_id);


--
-- Name: index_calendar_event_categorizations_on_news_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_calendar_event_categorizations_on_news_category_id ON public.calendar_event_categorizations USING btree (news_category_id);


--
-- Name: index_calendar_event_coins_on_coin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_calendar_event_coins_on_coin_id ON public.calendar_event_coins USING btree (coin_id);


--
-- Name: index_calendar_events_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_calendar_events_on_user_id ON public.calendar_events USING btree (user_id);


--
-- Name: index_coin_excluded_countries_on_coin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coin_excluded_countries_on_coin_id ON public.coin_excluded_countries USING btree (coin_id);


--
-- Name: index_coin_excluded_countries_on_country_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coin_excluded_countries_on_country_id ON public.coin_excluded_countries USING btree (country_id);


--
-- Name: index_coin_industries_coins_on_coin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coin_industries_coins_on_coin_id ON public.coin_industries_coins USING btree (coin_id);


--
-- Name: index_coin_industries_coins_on_coin_industry_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coin_industries_coins_on_coin_industry_id ON public.coin_industries_coins USING btree (coin_industry_id);


--
-- Name: index_coin_industries_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_coin_industries_on_name ON public.coin_industries USING btree (name);


--
-- Name: index_coins_on_coin_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_coins_on_coin_key ON public.coins USING btree (coin_key);


--
-- Name: index_coins_on_influencer_reviews_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coins_on_influencer_reviews_count ON public.coins USING btree (influencer_reviews_count);


--
-- Name: index_coins_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coins_on_name ON public.coins USING btree (name);


--
-- Name: index_coins_on_ranking; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_coins_on_ranking ON public.coins USING btree (ranking);


--
-- Name: index_coins_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_coins_on_slug ON public.coins USING btree (slug);


--
-- Name: index_contributor_submissions_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_contributor_submissions_on_user_id ON public.contributor_submissions USING btree (user_id);


--
-- Name: index_exchange_listings_on_base_symbol_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_exchange_listings_on_base_symbol_id ON public.exchange_listings USING btree (base_symbol_id);


--
-- Name: index_exchange_listings_on_detected_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_exchange_listings_on_detected_at ON public.exchange_listings USING btree (detected_at);


--
-- Name: index_exchange_listings_on_quote_symbol; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_exchange_listings_on_quote_symbol ON public.exchange_listings USING btree (quote_symbol);


--
-- Name: index_exchange_listings_on_quote_symbol_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_exchange_listings_on_quote_symbol_id ON public.exchange_listings USING btree (quote_symbol_id);


--
-- Name: index_exchange_supply_view; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_exchange_supply_view ON public.exchange_supply_view USING btree (coin_key);


--
-- Name: index_exchanges_on_ccxt_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_exchanges_on_ccxt_id ON public.exchanges USING btree (ccxt_id);


--
-- Name: index_feed_sources_on_coin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_feed_sources_on_coin_id ON public.feed_sources USING btree (coin_id);


--
-- Name: index_feed_sources_on_feed_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_feed_sources_on_feed_type ON public.feed_sources USING btree (feed_type);


--
-- Name: index_feed_sources_on_feed_url; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_feed_sources_on_feed_url ON public.feed_sources USING btree (feed_url);


--
-- Name: index_feed_sources_on_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_feed_sources_on_is_active ON public.feed_sources USING btree (is_active);


--
-- Name: index_feed_sources_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_feed_sources_on_name ON public.feed_sources USING btree (name);


--
-- Name: index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope ON public.friendly_id_slugs USING btree (slug, sluggable_type, scope);


--
-- Name: index_influencer_reviews_on_coin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_influencer_reviews_on_coin_id ON public.influencer_reviews USING btree (coin_id);


--
-- Name: index_influencer_reviews_on_influencer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_influencer_reviews_on_influencer_id ON public.influencer_reviews USING btree (influencer_id);


--
-- Name: index_market_metrics_on_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_market_metrics_on_timestamp ON public.market_metrics USING btree ("timestamp");


--
-- Name: index_metrics_chart_view; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_metrics_chart_view ON public.metrics_chart_view USING btree (metric_type, coin_key, date);


--
-- Name: index_news_categories_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_news_categories_on_name ON public.news_categories USING btree (name);


--
-- Name: index_news_coin_mentions_on_coin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_news_coin_mentions_on_coin_id ON public.news_coin_mentions USING btree (coin_id);


--
-- Name: index_news_coin_mentions_on_is_machine_tagged; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_news_coin_mentions_on_is_machine_tagged ON public.news_coin_mentions USING btree (is_machine_tagged);


--
-- Name: index_news_coin_mentions_on_news_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_news_coin_mentions_on_news_item_id ON public.news_coin_mentions USING btree (news_item_id);


--
-- Name: index_news_coin_mentions_on_news_item_id_and_coin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_news_coin_mentions_on_news_item_id_and_coin_id ON public.news_coin_mentions USING btree (news_item_id, coin_id);


--
-- Name: index_news_item_categorizations_on_news_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_news_item_categorizations_on_news_category_id ON public.news_item_categorizations USING btree (news_category_id);


--
-- Name: index_news_item_categorizations_on_news_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_news_item_categorizations_on_news_item_id ON public.news_item_categorizations USING btree (news_item_id);


--
-- Name: index_news_item_raws_on_news_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_news_item_raws_on_news_item_id ON public.news_item_raws USING btree (news_item_id);


--
-- Name: index_news_items_on_feed_item_published_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_news_items_on_feed_item_published_at ON public.news_items USING btree (feed_item_published_at);


--
-- Name: index_news_items_on_feed_source_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_news_items_on_feed_source_id ON public.news_items USING btree (feed_source_id);


--
-- Name: index_news_items_on_feed_source_id_and_feed_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_news_items_on_feed_source_id_and_feed_item_id ON public.news_items USING btree (feed_source_id, feed_item_id);


--
-- Name: index_news_items_on_is_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_news_items_on_is_published ON public.news_items USING btree (is_published);


--
-- Name: index_news_items_on_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_news_items_on_title ON public.news_items USING btree (title);


--
-- Name: index_news_items_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_news_items_on_user_id ON public.news_items USING btree (user_id);


--
-- Name: index_signals_telegram_subscriptions_on_coin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signals_telegram_subscriptions_on_coin_id ON public.signals_telegram_subscriptions USING btree (coin_id);


--
-- Name: index_signals_telegram_users_on_telegram_chat_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_signals_telegram_users_on_telegram_chat_id ON public.signals_telegram_users USING btree (telegram_chat_id);


--
-- Name: index_signals_telegram_users_on_telegram_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_signals_telegram_users_on_telegram_username ON public.signals_telegram_users USING btree (telegram_username);


--
-- Name: index_signals_telegram_users_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_signals_telegram_users_on_user_id ON public.signals_telegram_users USING btree (user_id);


--
-- Name: index_staked_cofi_transactions_on_is_txn_confirmations_gte_10; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_staked_cofi_transactions_on_is_txn_confirmations_gte_10 ON public.staked_cofi_transactions USING btree (is_txn_confirmations_gte_10);


--
-- Name: index_staked_cofi_transactions_on_txn_block_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_staked_cofi_transactions_on_txn_block_number ON public.staked_cofi_transactions USING btree (txn_block_number);


--
-- Name: index_staked_cofi_transactions_on_txn_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_staked_cofi_transactions_on_txn_hash ON public.staked_cofi_transactions USING btree (txn_hash);


--
-- Name: index_staked_cofi_transactions_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_staked_cofi_transactions_on_user_id ON public.staked_cofi_transactions USING btree (user_id);


--
-- Name: index_sts_on_signals_telegram_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sts_on_signals_telegram_user_id ON public.signals_telegram_subscriptions USING btree (signals_telegram_user_id);


--
-- Name: index_taggings_on_tag_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_taggings_on_tag_id ON public.taggings USING btree (tag_id);


--
-- Name: index_taggings_on_taggable_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_taggings_on_taggable_id ON public.taggings USING btree (taggable_id);


--
-- Name: index_tags_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_tags_on_name ON public.tags USING btree (name);


--
-- Name: index_token_distribution_100_view; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_token_distribution_100_view ON public.token_distribution_100_view USING btree (coin_key);


--
-- Name: index_token_retention_rate_view; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_token_retention_rate_view ON public.token_retention_rate_view USING btree (coin_key);


--
-- Name: index_token_velocity_view; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_token_velocity_view ON public.token_velocity_view USING btree (coin_key);


--
-- Name: index_trading_signal_notifications_on_external_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_trading_signal_notifications_on_external_id ON public.trading_signal_notifications USING btree (external_id);


--
-- Name: index_trading_signal_notifications_on_trading_signal_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_trading_signal_notifications_on_trading_signal_id ON public.trading_signal_notifications USING btree (trading_signal_id);


--
-- Name: index_trading_signal_notifications_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_trading_signal_notifications_on_user_id ON public.trading_signal_notifications USING btree (user_id);


--
-- Name: index_trading_signal_triggers_on_external_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_trading_signal_triggers_on_external_id ON public.trading_signal_triggers USING btree (external_id);


--
-- Name: index_trading_signal_triggers_on_type_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_trading_signal_triggers_on_type_key ON public.trading_signal_triggers USING btree (type_key);


--
-- Name: index_trading_signals_on_external_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_trading_signals_on_external_id ON public.trading_signals USING btree (external_id);


--
-- Name: index_trading_signals_on_trading_signal_trigger_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_trading_signals_on_trading_signal_trigger_id ON public.trading_signals USING btree (trading_signal_trigger_id);


--
-- Name: index_ts_on_trading_signal_trigger_external_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ts_on_trading_signal_trigger_external_id ON public.trading_signals USING btree (trading_signal_trigger_external_id);


--
-- Name: index_tsn_on_trading_signal_external_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_tsn_on_trading_signal_external_id ON public.trading_signal_notifications USING btree (trading_signal_external_id);


--
-- Name: index_unique_wallet_count_view; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_unique_wallet_count_view ON public.unique_wallet_count_view USING btree (coin_key);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_email ON public.users USING btree (email);


--
-- Name: index_users_on_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_provider ON public.users USING btree (provider);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON public.users USING btree (reset_password_token);


--
-- Name: index_users_on_token_sale_signals_telegram_bot_chat_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_token_sale_signals_telegram_bot_chat_id ON public.users USING btree (((token_sale ->> 'signals_telegram_bot_chat_id'::text)));


--
-- Name: index_users_on_token_sale_telegram_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_token_sale_telegram_username ON public.users USING gin (((token_sale ->> 'telegram_username'::text)) public.gin_trgm_ops);


--
-- Name: index_users_on_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_uid ON public.users USING btree (uid);


--
-- Name: index_users_on_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_username ON public.users USING btree (username);


--
-- Name: index_watchlist_items_on_coin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_watchlist_items_on_coin_id ON public.watchlist_items USING btree (coin_id);


--
-- Name: index_watchlist_items_on_watchlist_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_watchlist_items_on_watchlist_id ON public.watchlist_items USING btree (watchlist_id);


--
-- Name: index_watchlists_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_watchlists_on_user_id ON public.watchlists USING btree (user_id);


--
-- Name: taggings_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX taggings_idx ON public.taggings USING btree (tag_id, taggable_id, taggable_type, context, tagger_id, tagger_type);


--
-- Name: unique_index_news_coin_mention; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_index_news_coin_mention ON public.news_coin_mentions USING btree (news_item_id, coin_id, is_machine_tagged);


--
-- Name: coin_industries_coins fk_rails_0387069d14; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_industries_coins
    ADD CONSTRAINT fk_rails_0387069d14 FOREIGN KEY (coin_id) REFERENCES public.coins(id);


--
-- Name: news_coin_mentions fk_rails_05dd4bb6cf; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_coin_mentions
    ADD CONSTRAINT fk_rails_05dd4bb6cf FOREIGN KEY (news_item_id) REFERENCES public.news_items(id);


--
-- Name: watchlists fk_rails_0dc1a4cbcb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlists
    ADD CONSTRAINT fk_rails_0dc1a4cbcb FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: influencer_reviews fk_rails_169b58e5d9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.influencer_reviews
    ADD CONSTRAINT fk_rails_169b58e5d9 FOREIGN KEY (influencer_id) REFERENCES public.influencers(id) ON DELETE CASCADE;


--
-- Name: exchange_listings fk_rails_1a3fcb255b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exchange_listings
    ADD CONSTRAINT fk_rails_1a3fcb255b FOREIGN KEY (exchange_id) REFERENCES public.exchanges(id);


--
-- Name: news_item_categorizations fk_rails_1cbafe8142; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_item_categorizations
    ADD CONSTRAINT fk_rails_1cbafe8142 FOREIGN KEY (news_item_id) REFERENCES public.news_items(id);


--
-- Name: calendar_event_categorizations fk_rails_1e8c92bc8e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_event_categorizations
    ADD CONSTRAINT fk_rails_1e8c92bc8e FOREIGN KEY (calendar_event_id) REFERENCES public.calendar_events(id);


--
-- Name: calendar_event_coins fk_rails_282d06432e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_event_coins
    ADD CONSTRAINT fk_rails_282d06432e FOREIGN KEY (coin_id) REFERENCES public.coins(id);


--
-- Name: news_items fk_rails_283923e70c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_items
    ADD CONSTRAINT fk_rails_283923e70c FOREIGN KEY (feed_source_id) REFERENCES public.feed_sources(id);


--
-- Name: exchange_listings fk_rails_2ca022796b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exchange_listings
    ADD CONSTRAINT fk_rails_2ca022796b FOREIGN KEY (base_symbol_id) REFERENCES public.coins(id);


--
-- Name: author_profiles fk_rails_41a0c17e74; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author_profiles
    ADD CONSTRAINT fk_rails_41a0c17e74 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: trading_signals fk_rails_42ca97749a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_signals
    ADD CONSTRAINT fk_rails_42ca97749a FOREIGN KEY (trading_signal_trigger_id) REFERENCES public.trading_signal_triggers(id);


--
-- Name: coin_excluded_countries fk_rails_474044307d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_excluded_countries
    ADD CONSTRAINT fk_rails_474044307d FOREIGN KEY (coin_id) REFERENCES public.coins(id) ON DELETE CASCADE;


--
-- Name: exchange_listings fk_rails_4b21aca769; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exchange_listings
    ADD CONSTRAINT fk_rails_4b21aca769 FOREIGN KEY (quote_symbol_id) REFERENCES public.coins(id);


--
-- Name: trading_signal_notifications fk_rails_4c3a633a06; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_signal_notifications
    ADD CONSTRAINT fk_rails_4c3a633a06 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: contributor_submissions fk_rails_51b86c9985; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contributor_submissions
    ADD CONSTRAINT fk_rails_51b86c9985 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: news_item_categorizations fk_rails_5d2306654c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_item_categorizations
    ADD CONSTRAINT fk_rails_5d2306654c FOREIGN KEY (news_category_id) REFERENCES public.news_categories(id);


--
-- Name: influencer_reviews fk_rails_5e0a88ed73; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.influencer_reviews
    ADD CONSTRAINT fk_rails_5e0a88ed73 FOREIGN KEY (coin_id) REFERENCES public.coins(id) ON DELETE CASCADE;


--
-- Name: coin_excluded_countries fk_rails_5e71d3e633; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_excluded_countries
    ADD CONSTRAINT fk_rails_5e71d3e633 FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;


--
-- Name: watchlist_items fk_rails_667aa8f205; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlist_items
    ADD CONSTRAINT fk_rails_667aa8f205 FOREIGN KEY (coin_id) REFERENCES public.coins(id);


--
-- Name: staked_cofi_transactions fk_rails_688482d79e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staked_cofi_transactions
    ADD CONSTRAINT fk_rails_688482d79e FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: watchlist_items fk_rails_6edd9fa838; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlist_items
    ADD CONSTRAINT fk_rails_6edd9fa838 FOREIGN KEY (watchlist_id) REFERENCES public.watchlists(id);


--
-- Name: articles fk_rails_6f25533257; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT fk_rails_6f25533257 FOREIGN KEY (coin_id) REFERENCES public.coins(id);


--
-- Name: news_coin_mentions fk_rails_7780bc56c0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_coin_mentions
    ADD CONSTRAINT fk_rails_7780bc56c0 FOREIGN KEY (coin_id) REFERENCES public.coins(id);


--
-- Name: calendar_events fk_rails_930e3c0bf4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_events
    ADD CONSTRAINT fk_rails_930e3c0bf4 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: trading_signal_notifications fk_rails_9a43a9f762; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_signal_notifications
    ADD CONSTRAINT fk_rails_9a43a9f762 FOREIGN KEY (trading_signal_id) REFERENCES public.trading_signals(id);


--
-- Name: coin_industries_coins fk_rails_a5c0898734; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_industries_coins
    ADD CONSTRAINT fk_rails_a5c0898734 FOREIGN KEY (coin_industry_id) REFERENCES public.coin_industries(id);


--
-- Name: calendar_event_coins fk_rails_a7b1b0eb74; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_event_coins
    ADD CONSTRAINT fk_rails_a7b1b0eb74 FOREIGN KEY (calendar_event_id) REFERENCES public.calendar_events(id);


--
-- Name: signals_telegram_subscriptions fk_rails_b1495dffa5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signals_telegram_subscriptions
    ADD CONSTRAINT fk_rails_b1495dffa5 FOREIGN KEY (signals_telegram_user_id) REFERENCES public.signals_telegram_users(id);


--
-- Name: news_items fk_rails_c54d05594f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_items
    ADD CONSTRAINT fk_rails_c54d05594f FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: contributor_submissions fk_rails_d3696dede3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contributor_submissions
    ADD CONSTRAINT fk_rails_d3696dede3 FOREIGN KEY (submission_category_id) REFERENCES public.submission_categories(id);


--
-- Name: feed_sources fk_rails_d7905b7825; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feed_sources
    ADD CONSTRAINT fk_rails_d7905b7825 FOREIGN KEY (coin_id) REFERENCES public.coins(id);


--
-- Name: signals_telegram_users fk_rails_ee09e210c4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signals_telegram_users
    ADD CONSTRAINT fk_rails_ee09e210c4 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: signals_telegram_subscriptions fk_rails_fa5f55b08d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signals_telegram_subscriptions
    ADD CONSTRAINT fk_rails_fa5f55b08d FOREIGN KEY (coin_id) REFERENCES public.coins(id);


--
-- Name: calendar_event_categorizations fk_rails_fe3be684e7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_event_categorizations
    ADD CONSTRAINT fk_rails_fe3be684e7 FOREIGN KEY (news_category_id) REFERENCES public.news_categories(id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20170903164342'),
('20170903171213'),
('20170904174545'),
('20170905155512'),
('20170907220851'),
('20170907220924'),
('20170908183218'),
('20170908183219'),
('20170908183220'),
('20170908183221'),
('20170908183222'),
('20170908183223'),
('20170913143902'),
('20171101182330'),
('20171116190251'),
('20171116190252'),
('20171116194619'),
('20171119225117'),
('20171120225256'),
('20180227114937'),
('20180227115542'),
('20180305045332'),
('20180305055543'),
('20180307044820'),
('20180326043054'),
('20180330015546'),
('20180330020006'),
('20180330022115'),
('20180330023221'),
('20180330071456'),
('20180330075054'),
('20180402070433'),
('20180405174214'),
('20180406014547'),
('20180406091445'),
('20180413062102'),
('20180415081641'),
('20180417055558'),
('20180419052645'),
('20180419053659'),
('20180419054701'),
('20180420035401'),
('20180425063045'),
('20180425064909'),
('20180430043527'),
('20180501045533'),
('20180501092658'),
('20180503095425'),
('20180504051223'),
('20180512055210'),
('20180524091549'),
('20180524092136'),
('20180525043435'),
('20180525143358'),
('20180530044725'),
('20180530045743'),
('20180604063450'),
('20180604203126'),
('20180605005836'),
('20180613051226'),
('20180613155411'),
('20180626084917'),
('20180628025816'),
('20180711070016'),
('20180714111613'),
('20180715011401'),
('20180715114637'),
('20180716123944'),
('20180731180201'),
('20180731185629'),
('20180803121611'),
('20180803130417'),
('20180812155516'),
('20180822034415'),
('20180826015433'),
('20180828071045'),
('20180831064949'),
('20180910025523'),
('20180912054352'),
('20180928070531'),
('20181004013839'),
('20181025031554'),
('20181025031912'),
('20181025032258'),
('20181026035424'),
('20181026104531'),
('20181029150802'),
('20181101055954'),
('20181101060308'),
('20181105021200'),
('20181108032049'),
('20181108095001'),
('20181113053237'),
('20181113094440'),
('20181113094453'),
('20181113095522'),
('20181119093300'),
('20181122014025'),
('20181123072657'),
('20181205102100'),
('20181220025108'),
('20181225103500'),
('20181225140500');


