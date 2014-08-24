webfonts-subsetting
===================

Tailor / Subsetting font files for web page automatically. The subsetted font will be used for webfonts service, and only contains characters used in that page.<br/>
It's useful for those languages with massive glyphs, such as Chinese Hanzi.


Usage
-------------------

As shown in /example:<br/>
1. Include jQuery in the page<br/>
2. Change the configurations at the begining of /src/webfonts.subsetting.js, and include it in the page<br/>
3. Change the configurations at the begining of /src/webfonts_subsetting.php and deploy it on a php server, whose url must be the one you specified in webfonts.subsetting.js:SUBSETTING_URL.<br/>
4. Configure the web server
###
    Install fontforge, which will be used in subsetting
    Make sure the php can execute fix_ttf.pe
    Make sure the php has WRITE access to the font directory
    Make sure the php has WRITE access to its own directory if you want to see logs

If every thing goes well, you'll see some subsetted font files in the fonts directory, and a <style> element of font-faces is added at the ending of <head>.<br/>
Or you can check the logs ( fix_ttf.out, mv_ttf.out ) beside webfonts_subsetting.php to find what happened.


Online Examples
-------------------

[Goto online example hosted on Wiki Media Fundation Labs](http://fonttailor.wmflabs.org/webfonts-subsetting)<br />
[Goto example integrated into mediawiki](http://fonttailor.wmflabs.org)<br />
