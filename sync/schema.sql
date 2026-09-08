-- One row per island per family code.
--
-- `addr` is not the family code. It is the first half of a PBKDF2 stretch of
-- it, so the server can find a row without ever being told the code, and the
-- second half of that same stretch is the key the save is encrypted with,
-- which never leaves the device. What is stored here is a random island id, a
-- counter, and a base64 lump nobody on this side can read.
--
-- `rev` is the save's own write counter, which state.js has always kept. A PUT
-- says which rev it believes is current and is refused if it is wrong, so two
-- devices cannot quietly overwrite each other: the loser is told, and asks.
CREATE TABLE IF NOT EXISTS saves (
  addr    TEXT    NOT NULL,
  island  TEXT    NOT NULL,
  rev     INTEGER NOT NULL,
  blob    TEXT    NOT NULL,
  updated TEXT    NOT NULL,
  PRIMARY KEY (addr, island)
);
