
-- DURING DEVELOPMENT --

GIT
Check into local repository in Dropbox/Palm Angels/Web/


SASS
Use local compiler, Codekit won’t work
1 Open Terminal
2 cd to Dropbox/Palm Angels/Web/
3 Run
  sass --watch assets/scss:assets/css --style compressed --sourcemap=none
Compiler will look for changes and spit out compressed pa.css
Check terminal for possible errors and reload browser



-- FINISHING PRODUCTION --

MICROSITES
Put a copy of PA book site in /book/
Put a copy of PA launch site in /worldtour/

VIDEO
Each mp4/mov in assets/v/
Convert to webm
Add webm source to <video> instances in index.html
