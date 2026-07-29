# neta

personal HTML archive

## Site structure

- `archive/`: archived HTML site files
- `quiz/`: Kiyomori random quiz
- `chatbot/`: Watasu Fumin chatbot with canonical data/spec files

## Access password

The static site uses `assets/access-gate.js` as a lightweight access-password
gate. It stores only a PBKDF2 hash in the repository, not the plain password.

Because this is a static site, this gate is useful for casual access control but
is not a substitute for hosting-level authentication. Use GitHub Pages private
visibility, Cloudflare Access, Basic Auth, or another server-side gate when the
archive must be truly hidden from direct file access.
