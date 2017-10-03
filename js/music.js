var isDebug = false;
var updateDate = "3 October 2017";
// Use the piece type identifiers defined in menu.js: PIA, VOC, INS, THE, FLM , ORC, EXP
// Pieces that are defined with ONLY PIA or INS turn up in their own lists; all others are inclusive
// of other types
var pieceArray = [  
   {  
      "title":"43222",
      "instrumentation":EXP,
      "year":1994,
      "duration":162,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/43222",
      "description":"A piece in which the metre is deliberately confusing.  The title gives one interpretation of how to count the 8th notes."
   },
   {  
      "title":"Algol (a Binary Star)",
      "instrumentation":EXP,
      "year":1984,
      "duration":260,
      "mp3":"javascript:openWidgetWindow(12343433)",
      "description":"Scored for analog synthesizer and tape loop.  The second half of the piece is completely dissimilar to the first half."
   },
   {  
      "title":"Algol Revisited",
      "instrumentation":EXP,
      "year":1984,
      "duration":114,
      "mp3":"javascript:openWidgetWindow(12343435)",
      "description":"Scored for DX7 and analog synthesizer.  Uses the same analog sequence, but no tape loop, and more DX7."
   },
   {  
      "title":"An Industrial Process",
      "instrumentation":PIA + VOC,
      "year":1984,
      "duration":92,
      "mus":"AnIndustrialProcess.pdf",
      "description":"Scored for alto and piano (words by Krafft A. Ehricke)"
   },
   {  
      "title":"Animation",
      "instrumentation":FLM,
      "year":1989,
      "mp3":"javascript:openWidgetWindow(12343455)",
      "description":"Themes and stings composed for a CTSR television documentary about animation."
   },
   {  
      "title":"Battle of the Bulge",
      "instrumentation":INS + FLM,
      "year":1994,
      "duration":30,
      "mp3":"javascript:openWidgetWindow(12343436)",
      "description":"Recorded to accompany an animated film of the same name produced at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A>."
   },
   {  
      "title":"Bobby's Song",
      "instrumentation":VOC + PIA + THE,
      "year":2008,
      "duration":93,
      "mus":"BobbysSong.pdf",
      "description":"Music for Kathy Macovichuk's play 'The Littlest Pirate', winner of the 2009 Robert C. Hayes award."
   },
   {  
      "title":"Bouncing Belly Button",
      "instrumentation":INS + FLM,
      "year":1994,
      "description":"Recorded to accompany an animated film of the same name, produced at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A>."
   },
   {  
      "title":"The Bridge",
      "instrumentation":PIA + VOC,
      "year":1988,
      "description":"Scored for alto, baritone, and piano (lyrics also by me). A love song in the traditional schmaltzy pop style."
   },
   {  
      "title":"Canada Disc & Tape",
      "instrumentation":FLM,
      "year":2015,
      "duration":48,
      "mp3":"http://youtu.be/37exWMQwq_c",
      "description":"Music and effects track for an old animated advertisement for Canada Disc & Tape, done as a classroom exercise."
   },
   {  
      "title":"Canon at the Octave",
      "instrumentation":PIA,
      "year":1992,
      "duration":35,
      "mus":"CanonOctave.pdf",
      "description":"Composed as an exercise in part writing."
   },
   {  
      "title":"Carol of the Bells",
      "instrumentation":VOC + INS,
      "year":1990,
      "duration":274,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/CaroloftheBells",
      "description":"Traditional, recorded using sampled voice and synthesized instruments."
   },
   {  
      "title":"Champagne",
      "instrumentation":INS + FLM,
      "year":1994,
      "description":"Recorded to accompany an animated film of the same name, produced at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A>."
   },
   {  
      "title":"Cold Thoughts",
      "instrumentation":PIA,
      "year":1978,
      "duration":98,
      "mus":"ColdThoughts.pdf",
      "description":"What's teenhood without a little angst?"
   },
   {  
      "title":"Communications",
      "instrumentation":INS + FLM,
      "year":1988,
      "mp3":"javascript:openWidgetWindow(12343437)",
      "description":"Composed for a <A HREF=http://sait.ab.ca/ target=_top>SAIT</A> Open House video produced by CTSR students."
   },
   {  
      "title":"Concert Overture",
      "instrumentation":ORC,
      "year":1986,
      "duration":248,
      "description":"Scored for wind ensemble."
   },
   {  
      "title":"CTSR March",
      "instrumentation":INS + FLM,
      "year":1988,
      "duration":171,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/CtsrMarch",
      "description":"Composed for a <A HREF=http://sait.ab.ca/ target=_top>SAIT</A> Open House video produced by CTSR students."
   },
   {  
      "title":"Cycling - the Sane Solution",
      "instrumentation":PIA + INS + FLM,
      "year":1989,
      "duration":55,
      "mus":"CyclingSaneSolution.pdf",
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/CyclingTheSaneSolution",
      "description":"Written for a 1-minute public service announcement about cycling, and performed on piano and synthesizer. Listen for the scene shifts between the carefree cyclist and the aggravated motorist."
   },
   {  
      "title":"Dance for Mixolydian Algorithms",
      "instrumentation":INS,
      "year":1985,
      "duration":180,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/DanceforMixolydianAlgorithms",
      "description":"Scored for RX15 percussion synthesizer, DX7 algorithm synthesizer, and piano."
   },
   {  
      "title":"Dancing Class (Arrangement)",
      "instrumentation":ARR + PIA + VOC,
      "year":2012,
      "duration":401,
      "mus":"DancingClass.pdf",
      "description":"Arrangement of Jane Siberry's piece from her 1984 album <a href=\"http://en.wikipedia.org/wiki/No_Borders_Here\">No Borders Here</a>"
   },
   {  
      "title":"Dead Loser I",
      "instrumentation":INS + FLM,
      "year":1989,
      "duration":30,
      "mp3":"javascript:openWidgetWindow(12343438)",
      "description":"Background music and sounds for a cocaine abuse PSA."
   },
   {  
      "title":"Dead Loser II",
      "instrumentation":INS + FLM,
      "year":1989,
      "duration":32,
      "mp3":"javascript:openWidgetWindow(12348596)",
      "description":"Background music and sounds for a cocaine abuse PSA."
   },
   {  
      "title":"December 5",
      "instrumentation":INS,
      "year":1991,
      "duration":342,
      "description":"A piece composed upon the dissolution of the U.S.S.R., with sounds which remind me of a desolate Russian winter."
   },
   {  
      "title":"Delusions",
      "instrumentation":PIA + INS,
      "year":1985,
      "duration":61,
      "mus":"Delusions.pdf",
      "description":"Scored for flute and piano, the piece is very fast and in constantly changing metre. Inspired by King Crimson's <em>Lark's Tongues in Aspic</em>. Playable with piano duet, if you don't happen to have a flute."
   },
   {  
      "title":"Door to Door",
      "instrumentation":PIA + INS + FLM,
      "year":1996,
      "duration":94,
      "description":"An adult animation class project produced by Kevin Kurytnik at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A>. Every short film had to start and end with the same image of a door, and the piece is consequently divided into very different sections, joined by a repeating sting, or brief motif. Scored for piano, organ, bass, percussion, and synthesizer."
   },
   {  
      "title":"Drunk Detective Show Theme",
      "instrumentation":INS + EXP,
      "year":2014,
      "duration":61,
      "mp3":"https://soundcloud.com/steve-hansen-smythe/drunk-detective-show-theme",
      "description":"A one-minute jazz-inspired exercise in 15/16 time: each bar has three beats, each beat having five pulses."
   },
   {  
      "title":"Eastern Desert Stereotype",
      "instrumentation":INS + FLM,
      "year":1991,
      "duration":201,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/EasternDesertStereotype",
      "description":"What the title says. Scored for percussion, bass, flute, and saxophone; recorded with synthesizers."
   },
   {  
      "title":"Elbow Falls Interlude",
      "instrumentation":FLM + ORC,
      "year":1996,
      "duration":159,
      "description":"Composed for the <B>Broadcast Filler Service</B> to accompany a video of this waterfall."
   },
   {  
      "title":"Engagement",
      "instrumentation":INS + EXP,
      "year":2005,
      "duration":214,
      "mp3":"javascript:openWidgetWindow(12343414)",
      "description":"Scored for two altos and synthesizer (or bass, guitar, zither, bagpipe, flute, oboe, trumpet, trombone, tuba, marimba, and percussion). A piece exploring alternative rhythms. (The primary time signature is five beats of dash-dotted quarters, and a dotted eighth.  See my <A HREF=placenotation.html>essay on modifications to music notation</A> if you want to know what a dash-dotted quarter is.)"
   },
   {  
      "title":"Engagement",
      "instrumentation":INS + EXP,
      "year":2015,
      "duration":214,
      "mp3":"https://soundcloud.com/steve-hansen-smythe/engagement",
      "description":"Re-recorded version of Engagement (2005) done on Logic Pro X."
   },
   {  
      "title":"Evangeline",
      "instrumentation":PIA + VOC + INS,
      "year":2012,
      "duration":285,
      "mus":"Evangeline.pdf",
      "description":"Words by Sappho Hansen Smythe. Recording scored for voice, flute, french horn, trumpet, percussion, acoustic guitar, bass guitar, piano, and strings; manuscript simplified for voice and piano."
   },
   {  
      "title":"Evening",
      "instrumentation":FLM,
      "year":1989,
      "duration":195,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/Evening",
      "description":"Based on a Mozart sonatina; originally composed for the <B>Canadian Cancer Society</B> video <em>BSE For Every Woman</em>."
   },
   {  
      "title":"Evolution of the Long-Tailed Bird",
      "instrumentation":INS + FLM,
      "year":1994,
      "description":"Recorded to accompany an animated film of the same name, produced at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A>."
   },
   {  
      "title":"Fanfare for Mark",
      "instrumentation":INS,
      "year":1983,
      "duration":4,
      "description":"Fanfare for three trombones, ending in a chord using deliberately mistuned notes, in honour of the ego and unbridled arrogance of another fellow trombonist, and played upon his arrival."
   },
   {  
      "title":"Five Jazzy Pieces",
      "instrumentation":PIA,
      "year":1970,
      "duration":132,
      "mus":"FiveJazzyPieces.pdf",
      "description":"Easy juvenilia."
   },
   {  
      "title":"FiveBeat",
      "instrumentation":EXP,
      "year":2001,
      "duration":185,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/Fivebeat",
      "description":"An experimental work in which each quarter note beat is divided into five equal parts.  Notating such time signatures and beats is a bear, unless one uses my <A HREF=placenotation.html>new modifications to music notation</A>."
   },
   {  
      "title":"Four to One",
      "instrumentation":INS,
      "year":1986,
      "duration":206,
      "mus":"FourtoOne.pdf",
      "mp3":"javascript:openWidgetWindow(12370114)",
      "description":"A lullaby for marimba, guitar, and bass."
   },
   {  
      "title":"Four-track improvisation in 11/8",
      "instrumentation":INS,
      "year":1984,
      "duration":178,
      "description":"I dragged my new DX7 into the electronic music lab at the University of Calgary and spent the holidays playing around.  (I had no multitracking capability at home.)"
   },
   {  
      "title":"Four-track improvisation in 15/8",
      "instrumentation":INS,
      "year":1984,
      "duration":286,
      "description":"I dragged my new DX7 into the electronic music lab at the University of Calgary and spent the holidays playing around.  (I had no multitracking capability at home.)."
   },
   {  
      "title":"Four-track improvisation in 4/4",
      "instrumentation":INS,
      "year":1984,
      "duration":233,
      "description":"I dragged my new DX7 into the electronic music lab at the University of Calgary and spent the holidays playing around.  (I had no multitracking capability at home.)."
   },
   {  
      "title":"The Front Door",
      "instrumentation":PIA,
      "year":1990,
      "duration":213,
      "description":"Slow, melancholy. Part of an impromptu suite of pieces, preceded by <em>The Kitchen Stirs At Dawn</em> and followed by <em>Glow in the Rear View Mirror</em>."
   },
   {  
      "title":"Fugue for Flute, Violin, and Viola",
      "instrumentation":INS,
      "year":1993,
      "duration":82,
      "mus":"FugueFluteViolinViola.pdf",
      "description":"A traditional three-voice fugue demonstrating various common fugal devices, but exhibiting too great a range to be playable on a single keyboard by a single player."
   },
   {  
      "title":"Fugue in d minor",
      "instrumentation":PIA,
      "year":1992,
      "duration":36,
      "mus":"FugueInDMinor.pdf",
      "description":"A traditional three-voice fugue written as an exercise, and playable on a keyboard."
   },
   {  
      "title":"Glow in the Rear View Mirror",
      "instrumentation":PIA + INS,
      "year":1990,
      "duration":253,
      "mus":"GlowRearViewMirror.pdf",
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/GlowintheRearViewMirror",
      "description":"Scored for two pianos, recorded on synthesizer. Based on <em>Vignettes</em> by Lee Sebel (a demo piece composed for owners of the Roland W30 Synthesizer).  The glow in the title is receding city lights.  At one point in the piece you hear the rush of a truck in the opposing lane."
   },
   {  
      "title":"Greed",
      "instrumentation":FLM,
      "year":1994,
      "duration":124,
      "mp3":"javascript:openWidgetWindow(12343456)",
      "description":"Recorded to accompany an animated film of the same name by Megan Evans, produced at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A>."
   },
   {  
      "title":"Hansen Smythe Sampler 1991",
      "instrumentation":INS,
      "year":1991,
      "duration":393,
      "mp3":"javascript:openWidgetWindow(7067916)",
      "description":"A spliced-together compilation of 14 pieces for demo purposes."
   },
   {  
      "title":"Happy Quarks",
      "instrumentation":INS,
      "year":1984,
      "duration":111,
      "mp3":"javascript:openWidgetWindow(12343443)",
      "description":"An early experiment using analog synths and a Roland MC4 Microcomposer (an analog sequencer), plus a Yamaha DX7."
   },
   {  
      "title":"IF, by chance, ENDIF",
      "instrumentation":EXP,
      "year":1996,
      "mus":"IfByChance.html",
      "description":"For any instrument, this is a computer program that runs as a macro in WordPerfect 6.1 or later. The program generates a printout of a monophonic sequence of between 10 and 110 notes, in a time signature between 3/8 and 15/8, with weighted random choices defining each note's pitch and duration."
   },
   {  
      "title":"In a Timepiece (i.e. Impatience)",
      "instrumentation":PIA,
      "year":1984,
      "duration":68,
      "mus":"InaTimepiece.pdf",
      "mp3":"javascript:openWidgetWindow(12367715)",
      "description":"I couldn't decide on which title I liked better.  They're anagrams of each other."
   },
   {  
      "title":"Inner Garden I (Arrangement)",
      "instrumentation":ARR + PIA + VOC,
      "year":2015,
      "duration":100,
      "mus":"InnerGardenI.pdf",
      "description":"Arrangement of King Crimson's piece from their 1995 album <a href=\"http://en.wikipedia.org/wiki/Thrak\">Thrak</a>"
   },
   {  
      "title":"Inner Garden II (Arrangement)",
      "instrumentation":ARR + PIA + VOC,
      "year":2015,
      "duration":70,
      "mus":"InnerGardenII.pdf",
      "description":"Arrangement of King Crimson's piece from their 1995 album <a href=\"http://en.wikipedia.org/wiki/Thrak\">Thrak</a>"
   },
   {  
      "title":"Invention in B Minor",
      "instrumentation":PIA,
      "year":1992,
      "duration":88,
      "mus":"InventionInBMinor.pdf",
      "description":"Composed as an exercise in part writing, the theme is invertible at the octave, and modulates into the relative major in the middle section, before being chopped up in dominant preparation.  I think it would sound good played by viola and 'cello."
   },
   {  
      "title":"Invention in E Minor",
      "instrumentation":PIA,
      "year":1992,
      "mus":"InventionInEMinor.pdf",
      "description":"Composed as a two-voice exercise in part writing."
   },
   {  
      "title":"Invention in D Major for Flute and Viola",
      "instrumentation":INS,
      "year":1997,
      "duration":75,
      "mus":"InventionInDMajor.pdf",
      "description":"Originally composed as an exercise in part writing in 1992, the piece was expanded and developed in 1997 as a wedding present for friends who played flute and viola."
   },
   {  
      "title":"Invention in Seven",
      "instrumentation":PIA,
      "year":1992,
      "duration":36,
      "mus":"InventionIn7.pdf",
      "description":"Composed as an exercise in part writing.  Sounds traditional but for the 7/8 time signature. Published 2011 in <U>Northern Lights, An Exploration of Canadian Piano Music</U>, Level 7 Musical Discoveries"
   },
   {  
      "title":"It's All About Friends",
      "instrumentation":VOC + PIA + THE,
      "year":2010,
      "duration":111,
      "mus":"ItsAllAboutFriends.pdf",
      "mp3":"javascript:openWidgetWindow(10303770)",
      "description":"Performed by Steve and Sappho Hansen Smythe.  The penultimate song from the children's musical by Kathy Macovichuk, \"The Princess and the Pea\". Princess Madeline tests Prince Roderick to see if he'd make a good friend for her. He has all the right answers, and she concludes that she's made a new friend."
   },
   {  
      "title":"It's All About Me",
      "instrumentation":VOC + PIA + THE,
      "year":2010,
      "duration":138,
      "mus":"ItsAllAboutMe.pdf",
      "mp3":"javascript:openWidgetWindow(9823011)",
      "description":"Performed by Steve and Sappho Hansen Smythe.  The second song from the children's musical by Kathy Macovichuk, \"The Princess and the Pea\". Lady London, Sir Anthony, and Sir Champ, all selfish people who are trying to ingratiate themselves with Prince Roderick, proclaim their egomania, while the royal family tries to convince them that this strategy is unsound."
   },
   {  
      "title":"Jam",
      "instrumentation":FLM,
      "year":1994,
      "description":"Produced my own animated film at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A>, entitled <CITE>Jam</CITE>, with soundtrack consisting mainly of sampled mouth noises. It was shown along with other animated films from Calgary in May 1996 at the Metro Cinema in Edmonton. I recognize that the film itself is not a composition <em>per se</em>, but the soundtrack is, so there!"
   },
   {  
      "title":"Journalism",
      "instrumentation":FLM,
      "year":1988,
      "mp3":"javascript:openWidgetWindow(12343447)",
      "description":"Composed for a <A HREF=http://sait.ab.ca/ target=_top>SAIT</A> Open House video produced by CTSR students."
   },
   {  
      "title":"Khazad-D&ucirc;m",
      "instrumentation":PIA,
      "year":1977,
      "duration":110,
      "mus":"KhazadDum.pdf",
      "mp3":"javascript:openWidgetWindow(11177859)",
      "description":"Scored for two pianos. Inspired by the dwarves' mines and metalworking caves in Moria, described in Tolkien's \"Lord of the Rings\". Won the Alberta and Canadian Registered Music Teachers' composition competitions in 1977."
   },
   {  
      "title":"King Arthur Fanfare",
      "instrumentation":THE,
      "year":1990,
      "duration":37,
      "mp3":"javascript:openWidgetWindow(12348571)",
      "description":"Fanfare for brass and percussion for <B>Storybook Theatre</B>'s production of <Q>Arthur and the Knights of the Round Table</Q>."
   },
   {  
      "title":"The Kitchen Stirs at Dawn",
      "instrumentation":INS,
      "year":1990,
      "duration":253,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/TheKitchenStirsAtDawn",
      "description":"A piece written for an imaginary animated film featuring a kitchen preparing breakfast, and an increasingly insistent alarm clock trying to get its owner out of bed."
   },
   {  
      "title":"The Last Flower",
      "instrumentation":PIA,
      "year":1979,
      "duration":120,
      "mus":"LastFlower.pdf",
      "description":"Composed to accompany the skit of the same name in <em>A Thurber Carnival</em> by James Thurber, performed by my high school drama department."
   },
   {  
      "title":"Les Pingoins Explorent/The Exploring Penguins I",
      "instrumentation":FLM,
      "year":1990,
      "duration":61,
      "mp3":"javascript:openWidgetWindow(12343441)",
      "description":"Music and sounds for the first of two versions of the animated film of the same name."
   },
   {  
      "title":"Les Pingoins Explorent/The Exploring Penguins II",
      "instrumentation":FLM,
      "year":1991,
      "duration":121,
      "mp3":"javascript:openWidgetWindow(12348568)",
      "description":"Music and sounds for the second of two versions of the animated film of the same name."
   },
   {  
      "title":"Library Technology",
      "instrumentation":FLM,
      "year":1988,
      "mp3":"javascript:openWidgetWindow(12343448)",
      "description":"Composed for a <A HREF=http://sait.ab.ca/ target=_top>SAIT</A> Open House video produced by CTSR students."
   },
   {  
      "title":"The Life Symphony",
      "instrumentation":ORC,
      "year":1996,
      "duration":1500,
      "mus":"LifeSymphony.pdf",
      "description":"For any number of instrumentalists, the more the merrier. My most philosophically important work. Dedicated to Stephen Jay Gould.  Five movements delimited by various biorevolutions (emergence of life, oxygen-releasing photosynthesis, multicellular life, colonization of land), aleatorically tracing the history of life at a ratio of 3 million years per second. Commissioned by the <B>Alberta Heritage Foundation for Medical Research</B>. Reorganized and rescored September 2006."
   },
   {  
      "title":"The Little Mermaid",
      "instrumentation":INS,
      "year":1984,
      "duration":138,
      "mp3":"javascript:openWidgetWindow(12343449)",
      "description":"Scored for synthesizer or guitar, strings, koto, and vibes. The first 27 seconds is by Kristal Calvert, and the rest is my additions, modifications, and expansions."
   },
   {  
      "title":"Level Up (Arrangement)",
      "instrumentation":ARR + VOC + PIA + INS,
      "year":2014,
      "duration":229,
      "mp3":"https://soundcloud.com/steve-hansen-smythe/level-up-cover",
      "mus":"LevelUp.pdf",
      "description":"Arrangement of Vienna Teng's piece, <a href=\"http://viennateng.bandcamp.com/track/level-up\">Level Up</a>, from her 2013 album <a href=\"http://viennateng.bandcamp.com/album/aims\">Aims</a>. Scored for two altos, grand piano, violin, trombone, and tin whistle."
   },
   {  
      "title":"Madeline's Lullaby",
      "instrumentation":VOC + PIA + THE,
      "year":2010,
      "duration":79,
      "mus":"MadelinesLullaby.pdf",
      "mp3":"javascript:openWidgetWindow(9823010)",
      "description":"Performed by Steve and Sappho Hansen Smythe.  The middle song from the children's musical by Kathy Macovichuk, \"The Princess and the Pea\". Princess Madeline is having a tough time falling asleep on that pile of mattresses, and sings herself this lullaby."
   },
   {  
      "title":"The Magnificat!",
      "instrumentation":FLM + ORC,
      "year":2013,
      "duration":312,
      "mp3":"javascript:openWidgetWindow(12336217)",
      "description":"Soundtrack to the <a href='http://youtu.be/FgoEcIAsXfs'>YouTube video</a> of the same name by I. H. Smythe."
   },
   {  
      "title":"Making Friends",
      "instrumentation":VOC + PIA + THE,
      "year":2010,
      "duration":167,
      "mus":"MakingFriends.pdf",
      "mp3":"javascript:openWidgetWindow(9823009)",
      "description":"Performed by Steve and Sappho Hansen Smythe. The closing song from the children's musical by Kathy Macovichuk, \"The Princess and the Pea\". The entire cast rehashes the characters and the moral, concluding that the best strategy for social interaction is to be nice."
   },
   {  
      "title":"March of the Recursive Satirists",
      "instrumentation":INS,
      "year":1990,
      "duration":368,
      "description":"A version of work composed for Esso Resources Canada Limited, which itself was a redo of a theme composed for an early computer game. I had only two tracks with which to work, so bass doubled as percussion."
   },
   {  
      "title":"Meedra Ma",
      "instrumentation":FLM,
      "year":1994,
      "duration":38,
      "mp3":"javascript:openWidgetWindow(12348570)",
      "description":"Scored for piano and bass; composed to accompany an animated film of the same name, produced at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A>."
   },
   {  
      "title":"Modal Variations",
      "instrumentation":PIA,
      "year":2000,
      "duration":840,
      "mus":"http://www.musicaneo.com/sheetmusic/sm-45598_modal_variations.html",
      "mp3":"http://stevehansensmythe.load.cd/sheetmusic/sm-45598_modal_variations.html",
      "description":"Seven piano variations in seven modes.  The tonic of each variation descends from the previous one by step, and the key signature of each has one fewer sharps than the previous one. Time signature loosely corresponds to the number of the mode."
   },
   {  
      "title":"Mope's Song",
      "instrumentation":VOC + PIA + THE,
      "year":1983,
      "duration":98,
      "mus":"MopesSong.pdf",
      "description":"Scored for tenor and either piano or guitar and bass (composed for<em> The Girl With The Expressive Eyebrows</em>, words by Charles Costello)"
   },
   {  
      "title":"Morning",
      "instrumentation":FLM,
      "year":1989,
      "duration":176,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/Morning",
      "description":"Based on a Mozart sonatina; originally composed for the <B>Canadian Cancer Society</B> video <em>BSE For Every Woman</em>."
   },
   {  
      "title":"Nana's Song",
      "instrumentation":VOC + PIA + THE,
      "year":2008,
      "duration":145,
      "mus":"NanasSong.pdf",
      "description":"Music for Kathy Macovichuk's play 'The Littlest Pirate', winner of the 2009 Robert C. Hayes award."
   },
   {  
      "title":"New Horizons",
      "instrumentation":VOC + PIA + THE,
      "year":2010,
      "duration":127,
      "mus":"NewHorizons.pdf",
      "mp3":"javascript:openWidgetWindow(9823012)",
      "description":"Performed by Steve and Sappho Hansen Smythe. The opening song from the children's musical by Kathy Macovichuk, \"The Princess and the Pea\". Prince Roderick is sad that he's had to move, and he's missing his old friends. His mother and the blokes from the moving company assure him, in song, that it'll be OK."
   },
   {  
      "title":"O Canada Ragtime",
      "instrumentation":ORC,
      "year":1990,
      "duration":76,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/OCanadaRagtime",
      "description":"A playful rendition of Canada's national anthem.  Scored for orchestra and ragtime pick-up band; recorded with synthesizers. The only one of my compositions to make it onto the Low Budget Radio  <A HREF=http://www.lowbudgetradio.com/ratearecord.html>Listener's Choice ballot</A> for 2005, where it came in 366th, being narrowly beat out by Stompin' Tom Connors The Man In The Moon Is A Newfie in 364th place, but beating out such classics as Pepe The Purple Platypus by Squish and the Pregnant Elephants. Go figure."
   },
   {  
      "title":"Of Aragorn",
      "instrumentation":PIA + VOC,
      "year":1983,
      "duration":81,
      "mus":"OfAragorn.pdf",
      "description":"Scored for soprano and piano, words by J.R.R. Tolkien."
   },
   {  
      "title":"Oh Lord, It's Hard To Play Country",
      "instrumentation":VOC + INS,
      "year":1984,
      "duration":64,
      "mus":"HardToPlayCountry.pdf",
      "description":"Scored for twangy country voice, guitar, bass, and snare drum."
   },
   {  
      "title":"The Old Country Dance",
      "instrumentation":PIA,
      "year":1969,
      "mus":"OldCountryDance.pdf",
      "description":"The first piece I composed that I actually think is good."
   },
   {  
      "title":"Paranoid Androids",
      "instrumentation":INS,
      "year":1990,
      "duration":238,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/ParanoidAndroids",
      "description":"I used the weird over-compressed end of a normal electric piano sample as a percussion instrument, and added wailing dischords. We danced around listening to it over and over the day I first recorded it."
   },
   {  
      "title":"Physics and the Art of Meditation",
      "instrumentation":INS,
      "year":1990,
      "duration":3000,
      "description":"Music by which to meditate, or watch <a href=\"http://flippingartgallery.com\">great art by Erica Neumann</a>!  The title is a joke.  Has nothing to do with physics.  Whipped up in time to sell cassettes at a science fiction/fantasy convention, and sales were satisfyingly brisk. Side one of the cassette was wet with water sounds, and side two was dry with crickets and percussion."
   },
   {  
      "title":"Piece for DX7 and Piano",
      "instrumentation":PIA + INS,
      "year":1985,
      "duration":204,
      "mus":"PieceforPianoandDX7.pdf",
      "description":"Performed by Steve Hansen Smythe and George Fenwick, some recital hour at the U of C."
   },
   {  
      "title":"Pirate Song",
      "instrumentation":VOC + PIA + THE,
      "year":2008,
      "duration":95,
      "mus":"PirateSong.pdf",
      "description":"Music for Kathy Macovichuk's play 'The Littlest Pirate', winner of the 2009 Robert C. Hayes award."
   },
   {  
      "title":"Premonition",
      "instrumentation":VOC + INS,
      "year":1983,
      "description":"Scored for four men's voices, clarinet, marimba, wind chimes (based on the poem by the same name by Robert W. Service)."
   },
   {  
      "title":"Prime Brass",
      "instrumentation":INS,
      "year":1982,
      "duration":221,
      "mus":"PrimeBrass.pdf",
      "mp3":"javascript:openWidgetWindow(12349499)",
      "description":"Scored for Trumpet, French horn, and Trombone. Every time signature is prime, there are a prime number of instruments, a prime number of bars in each section, and a prime number of 8th note beats in the entire piece."
   },
   {  
      "title":"Print Technology",
      "instrumentation":FLM,
      "year":1988,
      "mp3":"javascript:openWidgetWindow(12343450)",
      "description":"Composed for a <A HREF=http://sait.ab.ca/ target=_top>SAIT</A> Open House video produced by CTSR students."
   },
   {  
      "title":"Quality Time",
      "instrumentation":FLM,
      "year":1994,
      "mp3":"javascript:openWidgetWindow(12343452)",
      "description":"Recorded to accompany an animated film of the same name, produced at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A>."
   },
   {  
      "title":"RandoMIDI",
      "instrumentation":EXP,
      "year":2005,
      "description":"Java applet which plays pseudo-random phrases on your computer's sound card. I didn't maintain this code, so it's no longer available."
   },
   {  
      "title":"Rose the Cat interprets Psalm 23",
      "instrumentation":FLM + ORC,
      "year":2012,
      "duration":262,
      "mp3":"javascript:openWidgetWindow(11894926)",
      "description":"Soundtrack to the <a href=\"http://youtu.be/UF4eW4WA4bM\">YouTube video</a> of the same name, by I. H. Smythe."
   },
   {  
      "title":"The Saamis I",
      "instrumentation":FLM,
      "year":1989,
      "duration":25,
      "mp3":"javascript:openWidgetWindow(12343457)",
      "description":"Themes and stings composed for a CTSR radio play of the same name. The radio play which this music accompanies, The Saamis, was about how the town of Medicine Hat came to get its name. It dramatized three different versions of a Native American story."
   },
   {  
      "title":"The Saamis II",
      "instrumentation":FLM,
      "year":1989,
      "duration":71,
      "mp3":"javascript:openWidgetWindow(12343458)",
      "description":"Themes and stings composed for a CTSR radio play of the same name. The radio play which this music accompanies, The Saamis, was about how the town of Medicine Hat came to get its name. It dramatized three different versions of a Native American story."
   },
   {  
      "title":"The Saamis III",
      "instrumentation":FLM,
      "year":1989,
      "duration":29,
      "mp3":"javascript:openWidgetWindow(12343459)",
      "description":"Themes and stings composed for a CTSR radio play of the same name. The radio play which this music accompanies, The Saamis, was about how the town of Medicine Hat came to get its name. It dramatized three different versions of a Native American story."
   },
   {  
      "title":"The Saamis IV",
      "instrumentation":FLM,
      "year":1989,
      "duration":27,
      "mp3":"javascript:openWidgetWindow(12343460)",
      "description":"Themes and stings composed for a CTSR radio play of the same name. The radio play which this music accompanies, The Saamis, was about how the town of Medicine Hat came to get its name. It dramatized three different versions of a Native American story."
   },
   {  
      "title":"Scuba Siv",
      "instrumentation":FLM,
      "year":1994,
      "description":"Two versions of this music were composed for two versions of Don Filipchuk's animated film of the same name, produced at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A>."
   },
   {  
      "title":"Seven-spheres",
      "instrumentation":EXP,
      "year":1985,
      "description":"An attempt to create music by constantly varying the timbre of the sound through seven instrumental sounds, while chords changed slowly through a 35-bar pattern."
   },
   {  
      "title":"A Short String Thing",
      "instrumentation":INS,
      "year":1983,
      "duration":62,
      "mus":"ShortStringThing.pdf",
      "description":"Scored for string quartet.  Time signature a fast 11/8."
   },
   {  
      "title":"Siv Polka",
      "instrumentation":FLM,
      "year":1998,
      "duration":49,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/SivPolka",
      "description":"Scored for solo accordion. Composed and recorded for Don Filipchuk's animated film, <B>Vacuum Siv</B>, produced at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A."
   },
   {  
      "title":"Siv Tango",
      "instrumentation":FLM,
      "year":1998,
      "duration":71,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/SivTango",
      "description":"Scored for accordion, bass, and shaker. Composed and recorded for Don Filipchuk's animated film, <B>Vacuum Siv</B>, produced at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A."
   },
   {  
      "title":"Six, Five",
      "instrumentation":PIA + INS,
      "year":1998,
      "duration":171,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/SixFive",
      "description":"Piano duet in varying metre (take a guess from the title), originally scored for synthesizer."
   },
   {  
      "title":"Sleeping",
      "instrumentation":PIA,
      "year":1970,
      "duration":60,
      "mus":"Sleeping.pdf",
      "description":"Easy juvenilia."
   },
   {  
      "title":"Sonata for Violin and Piano",
      "instrumentation":PIA + INS,
      "year":1986,
      "description":"First and second movements only, and never finished. An experiment with non-standard scales."
   },
   {  
      "title":"Soundtrack Improv",
      "instrumentation":EXP,
      "year":1984,
      "duration":186,
      "mp3":"javascript:openWidgetWindow(12343540)",
      "description":"Moody improvisation on four tracks, recorded in the electronic music lab at the U of Calgary."
   },
   {  
      "title":"The Space Promotion Anthem",
      "instrumentation":VOC,
      "year":1998,
      "duration":66,
      "mus":"SpaceAnthem.pdf",
      "description":"Word got around, in the space activist community, that what we really needed was a rousing anthem, and that if only we'd sing together in mutual harmony and understanding, the rockets would go up and the solar power satellites would get built. This is my attempt, using Alexander Courage's opening theme from Star Trek as the cantus firmus (and that's not easy!), and appropriately international Esperanto lyrics by my mother, Jean Smythe:<P style=\"font-style:italic\">En la kosmon baldau voja&#285;os ni!<br>Revojn esperplene plenumos ni.<br>Antaen, eksteren, kaj supren ni flugos del' Tero, por<br>fondi novmondon, ja estas la ceelo.</P><P style=\"font-style:italic\">Vidu, jen atendas nin nia &#265;ar'!<br>Sidu, a ventureema kolegar'!<br>Pezofortego ense&#285;en nin premas, travibras<br>ekscito, pro fora voja&#285;o al nova hejm'!</P><P style=\"font-style:italic\">Fore en la spacurbo lo&#285;os ni!<br>novdefiojn sa&#285;e forvenkos ni!<br>Tiam laboros ni &#265;iuj por kuna boneco, kaj<br>Forte konstruos sunpotencigiilon.</P>"
   },
   {  
      "title":"Stardrift",
      "instrumentation":PIA,
      "year":1976,
      "duration":185,
      "mus":"Stardrift.pdf",
      "description":"Won first in Calgary and Alberta Kiwanis Festivals, and first in the Alberta Registered Music Teachers' Composition Competition."
   },
   {  
      "title":"Stinky Pete's Song",
      "instrumentation":VOC + PIA + THE,
      "year":2008,
      "duration":111,
      "mus":"StinkyPetesSong.pdf",
      "description":"Music for Kathy Macovichuk's play 'The Littlest Pirate', winner of the 2009 Robert C. Hayes award."
   },
   {  
      "title":"Sundayalysis",
      "instrumentation":EXP,
      "year":1993,
      "duration":316,
      "mp3":"http://www.cdbaby.com/cd/stevehansensmythe/Sundayalysis",
      "description":"A decomposition of sound samples all taken one Sunday morning, featuring the Gregorian Chant Choir of Calgary (in which I sang), and sounds from the tower bells of Christ Church, Elbow Park, where I have rung bells off and on for 25 years."
   },
   {  
      "title":"A Synthesized Minute",
      "instrumentation":INS,
      "year":2013,
      "duration":56,
      "mp3":"javascript:openWidgetWindow(12377268)",
      "description":"Just playing around with analog synth sounds for a minute."
   },
   {  
      "title":"Takakkaw Falls",
      "instrumentation":FLM + ORC,
      "year":2009,
      "duration":250,
      "mus":"http://www.musicaneo.com/sheetmusic/sm-43504_takakkaw_falls.html",
      "mp3":"javascript:openWidgetWindow(8222135)",
      "description":"Performed by Westmount Charter School's Senior Orchestra in June 2010. A simpler version of this piece was composed in 1996 for the <B>Broadcast Filler Service</B> to accompany a video of this waterfall."
   },
   {  
      "title":"The Tale of Tinuviel",
      "instrumentation":VOC + PIA + INS,
      "year":1980,
      "description":"Scored for tenor and piano or folk instruments (words by J.R.R. Tolkien)"
   },
   {  
      "title":"Tangle Creek Interlude",
      "instrumentation":FLM + ORC,
      "year":1996,
      "duration":261,
      "mp3":"javascript:openWidgetWindow(12347854)",
      "description":"Scored for orchestra and piano.  Composed for the <B>Broadcast Filler Service</B> to accompany a video of this creek."
   },
   {  
      "title":"Telephone Answering Machine Message",
      "instrumentation":VOC,
      "year":1980,
      "mus":"TelephoneAnsweringMachineMessage.pdf",
      "description":"Scored for four men's voices."
   },
   {  
      "title":"Theme and Variations",
      "instrumentation":PIA,
      "year":1984,
      "duration":295,
      "mus":"http://www.musicaneo.com/sheetmusic/sm-85472_theme_and_variations.html",
      "mp3":"javascript:openWidgetWindow(11384708)",
      "description":"Revised in 1987, intermediate difficulty.  Theme and five variations, based on two 12-tone rows generated by a program in Basic running on a Timex Sinclair ZX81 computer. Performed by Gordon Rumson in concert in 1994."
   },
   {  
      "title":"Theory Student Electro Shock Collar",
      "instrumentation":VOC + INS,
      "year":1993,
      "duration":45,
      "mp3":"javascript:openWidgetWindow(12343440)",
      "description":"An imaginary radio advertisement for a really useful product - if you're a music theory teacher."
   },
   {  
      "title":"Thirteen Elephants I & II",
      "instrumentation":INS,
      "year":1984,
      "duration":69,
      "mp3":"javascript:openWidgetWindow(12343454)",
      "description":"Two synthesized versions of the second variation of the Theme and Variations."
   },
   {  
      "title":"Tigger",
      "instrumentation":PIA + THE,
      "year":1997,
      "duration":34,
      "mus":"Tigger.pdf",
      "description":"A short version of music originally composed for Storybook Theatre's production of <em>A House At Pooh Corner</em>. It's harder than it sounds.  The performer may <em>ad libitum</em> twang a metal or plastic ruler against the piano on each 8th note rest."
   },
   {  
      "title":"Train Variations",
      "instrumentation":PIA,
      "year":2005,
      "duration":614,
      "mus":"http://www.cncm.ca/making-tracks.html",
      "description":"A suite of seven variations, co-written with Gordon Rumson, using three Russion folk songs. Each of us composed one part of some of the seven variations, then passed the piece on to the other, who composed the missing part. The variations are a metaphor for a train journey across Russia, starting with a View of Japan and ending as the train arrives in Moscow with Bells of Mother Russia. Published in <Q>Making Tracks Vol. 3</Q> by Canadian National Conservatory of Music."
   },
   {  
      "title":"Type A",
      "instrumentation":FLM + INS,
      "year":2006,
      "duration":112,
      "mp3":"http://www.youtube.com/watch?v=yfzNxcvBAY4",
      "description":"Recorded to accompany an animated film of the same name by Ray Smith, produced at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A>. Scored for piano, guitar, bass, drums, strings, xylophone. and typewriter. The film follows a type A character who has difficulty with a computer, a typewriter, and eventually even a pencil."
   },
   {  
      "title":"Unstoppable",
      "instrumentation":PIA,
      "year":1998,
      "duration":103,
      "mus":"Unstoppable.pdf",
      "description":"Scored for piano, intermediate difficulty, phrygian mode.  Also scored as a string quartet. I also stole thematic material for the soundtrack to an animated film, <B>Type A</B>, by Ray Smith, produced at <A HREF=http://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A>."
   },
   {  
      "title":"Unstoppable",
      "instrumentation":INS,
      "year":1998,
      "duration":103,
      "mus":"UnstoppableStrings.pdf",
      "description":"Scored for string quartet, intermediate difficulty, phrygian mode.  Also scored for piano solo."
   },
   {  
      "title":"Waiting (Arrangement)",
      "instrumentation":ARR + PIA + VOC,
      "year":2012,
      "duration":270,
      "mus":"Waiting.pdf",
      "description":"Arrangement of Kevin Gilbert's piece from his 1995 album <a href=\"http://en.wikipedia.org/wiki/Live_at_the_Troubadour_(Kevin_Gilbert_%26_Thud)\">Welcome to Joytown - Thud: Live at the Troubadour</a>"
   },
   {  
      "title":"Wendy",
      "instrumentation":PIA + VOC,
      "year":1979,
      "duration":90,
      "mus":"Wendy.pdf",
      "description":"Scored for piano and cracking testosterone-laden baritone, or flute (words, embarrassingly, by me)"
   },
   {  
      "title":"While Walking",
      "instrumentation":PIA,
      "year":1985,
      "duration":262,
      "mus":"http://www.musicaneo.com/sheetmusic/sm-85627_while_walking.html",
      "mp3":"javascript:openWidgetWindow(11353195)",
      "description":"An easy piece so long as you have big hands, having an improvisatory feel.  Reading the score is difficult not because the notes are hard to play, but that standard notation does not deal well with chords built up a note at a time."
   },
   {  
      "title":"Willowind",
      "instrumentation":PIA,
      "year":1974,
      "duration":88,
      "mus":"Willowind.pdf",
      "description":"Easy juvenilia, using Beethoven's F&uuml;r Elise for thematic inspiration. Shared first place at Calgary Kiwanis music festival."
   },
   {  
      "title":"Zig Zag",
      "instrumentation":PIA,
      "year":2011,
      "duration":103,
      "mus":"ZigZag.pdf",
      "description":"This piece requires a lot of movement of the left hand, and consecutive fifths in the right. The modal sound is achieved mainly by using the subtonic (the note a whole tone below the tonic) rather than the leading note."
   }
];


// get typeArray from menu.js. Must load that prior to this!

function getParams()
{
  var params = document.location.search;

  // strip off the leading '?'
  params = params.substring(1);
  return params.split("&");
}

// The pieceIndex is only used for bookmarking individual pieces. The page does not create pieceIndex values
function getPieceIndex()
{
  var pieceIndex = -1;
  var params = getParams();
  for ( i = 0; i < params.length; i++)
  {
    var nvPair = params[i].split("=");
    if ("p" == nvPair[0])
    {
      pieceIndex = parseInt(nvPair[1]);
      if (isDebug)
      {
        console.log("found pieceIndex=" + pieceIndex);
      }
    }
  }
  if (isNaN(pieceIndex))
  {
    // garbage could not be understood as a number
    pieceIndex = -1;
  }
  else if (0 > pieceIndex || pieceIndex >= pieceArray.length)
  {
    // valid number, but outside meaningful range
    pieceIndex = -1;
  }
  return pieceIndex;
}

// This value is sent to the URL when enter is pressed after entering a search term.
function getQueryValue()
{
  var query = "";
  var params = getParams();
  for ( i = 0; i < params.length; i++)
  {
    var nvPair = params[i].split("=");
    if ("q" == nvPair[0])
    {
      query = nvPair[1];
      // query parameters get spaces replaced by + signs. Put the spaces back in
      query = query.replace(/\+/g, " ");
      if (isDebug)
      {
        console.log("found query=" + query);
      }
    }
  }
  return query;
}

// This value is received in a URL, and used to filter music results
function getType()
{
  var type;
  // a Type object, if we're lucky
  var params = getParams();
  for ( i = 0; i < params.length; i++)
  {
    var nvPair = params[i].split("=");
    if ("t" == nvPair[0])
    {
      // there is a "type" parameter. Is there a matching Type object?
      for ( i = 0; i < typeArray.length; i++)
      {
        if (typeArray[i].id == nvPair[1].toLowerCase())
        {
          type = typeArray[i];
          if (isDebug)
          {
            console.log("found type=" + type.title + "=" + type.id);
          }
          break;
        }
      }
      break;
    }
  }
  return type;
}

// add an anchor for a score
function addScoreAnchor(mediaCell, anchorPiece)
{
  if (anchorPiece.mus)
  {
    var anchor;
    if (anchorPiece.mus.indexOf("/") > -1)
    {
      // assume it's an absolute path
      anchor = getMediaAnchor(anchorPiece.mus, "score.gif", 24, 24, "Score");
    }
    else
    {
      // assume it's a local location in the scores directory
      anchor = getMediaAnchor("scores/" + anchorPiece.mus, "score.gif", 24, 24, "Score");
    }
    mediaCell.appendChild(anchor);
  }
}

// add an anchor for an MP3 file or page
function addMP3Anchor(mediaCell, anchorPiece)
{
  if (anchorPiece.mp3)
  {
    var anchor = getMediaAnchor(anchorPiece.mp3, "mp3.gif", 24, 24, "MP3 Download");
    mediaCell.appendChild(anchor);
  }
}

// called from addXAnchor functions
function getMediaAnchor(filepath, imagename, imagewidth, imageheight, imagealt)
{
  var mediaImage = document.createElement("img");
  mediaImage.src = "images/" + imagename;
  mediaImage.border = "1";
  mediaImage.width = imagewidth;
  mediaImage.height = imageheight;
  mediaImage.alt = imagealt;

  var mediaAnchor = document.createElement("a");
  mediaAnchor.href = filepath;
  mediaAnchor.appendChild(mediaImage);
  return mediaAnchor;
}

function getFormattedTime(timePiece)
{
  if (!timePiece.duration)
  {
    return "";
  }
  // Assume no piece exceeds 1 hour
  var minutes = Math.floor(timePiece.duration / 60);
  var seconds = timePiece.duration % 60;
  // There is no javascript function to format with leading zero
  if (seconds < 10)
  {
    return minutes + ":0" + seconds;
  }
  else
  {
    return minutes + ":" + seconds;
  }
}

function openWidgetWindow(sid)
{
  // Internet Explorer does not correctly load the Soundclick player. Provide an alternative.
  var browserName = navigator.appName;
  if (browserName == "Microsoft Internet Explorer")
  {
    window.open('http://www.soundclick.com/bands/page_songInfo.cfm?bandID=246361&songID=' + sid, 'soundclick');
  }
  else
  {
    window.open('mp3/widget.html?sid=' + sid, 'widget', 'width=503,height=130,resizable=0,scrollbars=0,toolbar=0,location=0,directories=0,menubar=0,copyhistory=0');
  }
}

