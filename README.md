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

If every thing goes well, you'll see some subsetted font files in the fonts directory, and a &lt;style&gt; element of font-faces is added at the ending of &lt;head&gt;.<br/>
Or you can check the logs ( fix_ttf.out, mv_ttf.out ) beside webfonts_subsetting.php to find what happened.


Online Examples
-------------------

[Goto online example hosted on Wiki Media Fundation Labs](http://fonttailor.wmflabs.org/webfonts-subsetting)<br />
[Goto example integrated into mediawiki](http://fonttailor.wmflabs.org)<br />


Better Integration
-------------------
I implement this as simple as possible, to make it extensible for different scenarios. Maybe you need some ideas about how to integrate it better.<br/>
1. Cache. Subsetting is a time-consuming work, so you'd better cache the subsetted fonts. And during the subsetting request, send a hash first to expect cache-hitting, while not send the huge set of characters sequence.<br/>
2. Lock. Conflicts may happen when multiple requests for the same subsetting job reach at the same time, so you'd better have a lock when you doing subsetting for each subset.<br/>
