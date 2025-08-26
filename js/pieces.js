// Updated 16 November 2024

/**
 * Pieces may have more than one type
 */
class PieceType {
    constructor(id, title) {
      this.id = id;
      this.title = title;
    }
}

const PIANO = new PieceType('piano', 'Piano pieces');
const VOICE = new PieceType('voice', 'Vocal pieces');
const INSTR = new PieceType('instr', 'Other Instrumental pieces');
const THEATRE = new PieceType('theatre', 'Pieces for live theatre');
const FILM = new PieceType('film', 'Pieces for film or broadcast media');
const ORCH = new PieceType('orch', 'Orchestral works');
const EXP = new PieceType('exp', 'Experimental pieces');
const ARR = new PieceType('arr', 'Covers of other pieces');

const pieceTypes = [PIANO, VOICE, INSTR, THEATRE, FILM, ORCH, EXP, ARR];

/**
 * For pieces on SoundClick, open a new window that loads the SoundClick widget
 * @param {number} sid - Soundclick song ID
 */
function openWidgetWindow(sid)
{
    window.open(`https://www.soundclick.com/artist/utils/songVideo.cfm?bandID=246361&songid=${sid}`);
}

class Piece {
    /**
     * @param {string} title
     * @param {object[]} types - Array of one or more pieceTypes used for filtering
     * @param {number} year - Year composed
     * @param {number} duration - Number of seconds duration
     * @param {object} media - Object containing from 0 to 2 media elements that populate the recording and scores fields
     * @param {string} description
     */
    constructor(title, types, year, duration, media, description) {
        this.title = title;
        this.types = types;
        this.year = year;
        this.duration = duration;
        if (this.duration) {
            // Assume no piece exceeds 1 hour
            const minutes = Math.floor(this.duration / 60).toString();
            const seconds = (this.duration % 60).toString();
            this.formattedTime = `${minutes}:${seconds.padStart(2, '0')}`;
        } else {
            // No duration. Set default blank string
            this.formattedTime = "";
        }
        if (media.youtube) {
            this.recording = `https://www.youtube.com/watch?v=${media.youtube}`;
        } else if (media.soundClick) {
            this.recording = `javascript:openWidgetWindow(${media.soundClick})`;
        } else if (media.soundCloud) {
            this.recording = `https://soundcloud.com/steve-hansen-smythe/${media.soundCloud}`;
        } else if (media.mp3) {
            this.recording = `mp3/${media.mp3}`;
        }
        if (media.pdf) {
            this.score = `scores/${media.pdf}`;
        } else if (media.html) {
            this.score = media.html;
        } else if (media.musicaneo) {
            this.score = `https://www.musicaneo.com/sheetmusic/${media.musicaneo}.html`;
        }

        this.description = description;
    }
}

const pieces = [
    new Piece("43222", [EXP], 1994, 162, { youtube: "3RO7wqO3GgI" }, "A piece in which the metre is deliberately confusing. The title gives one interpretation of how to count the 8th notes."),
    new Piece("Algol (a Binary Star)", [EXP], 1984, 260, { soundClick: "12343433" }, "Scored for analog synthesizer and tape loop. The second half of the piece is completely dissimilar to the first half."),
    new Piece("Algol Revisited", [EXP], 1984, 114, { soundClick: "12343435" }, "Scored for DX7 and analog synthesizer. Uses the same analog sequence, but no tape loop, and more DX7."),
    new Piece("An Industrial Process", [PIANO, VOICE], 1984, 92, { pdf: "AnIndustrialProcess.pdf" }, "Scored for alto and piano (words by Krafft A. Ehricke)"),
    new Piece("Animation", [FILM], 1989, 0, { soundClick: "12343455" }, "Themes and stings composed for a CTSR television documentary about animation."),
    new Piece("Battle of the Bulge", [INSTR, FILM], 1994, 30, { soundClick: "12343436" }, "Recorded to accompany an animated film of the same name produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>."),
    new Piece("Blaah!", [INSTR, FILM], 1994, 79, { mp3: "Blaah!.mp3"}, "Recorded to accompany an animated film of the same name, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>. Unfortunately I lost my original project, so this recording is a poor rendition from an old cassette."),
    new Piece("Bobby's Song", [VOICE, PIANO, THEATRE], 2008, 93, { pdf: "BobbysSong.pdf" }, "Music for Kathy Macovichuk's play 'The Littlest Pirate', winner of the 2009 Robert C. Hayes award."),
    new Piece("Bouncing Belly Button", [INSTR, FILM], 1994, 0, {}, "Recorded to accompany an animated film of the same name, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>."),
    new Piece("The Bridge", [PIANO, VOICE], 1988, 0, {}, "Scored for alto, baritone, and piano (lyrics also by me). A love song in the traditional schmaltzy pop style."),
    new Piece("Canada Disc & Tape", [FILM], 2015, 48, { youtube: "37exWMQwq_c" }, "Music and effects track for an old animated advertisement for Canada Disc & Tape, done as a classroom exercise."),
    new Piece("Canon at the Octave", [PIANO], 1992, 35, { pdf: "CanonOctave.pdf" }, "Composed as an exercise in part writing."),
    new Piece("Carol of the Bells", [VOICE, INSTR], 1990, 274, { youtube: "OM-wJ52JM7I" }, "Traditional, recorded using sampled voice and synthesized instruments."),
    new Piece("Champagne", [INSTR, FILM], 1994, 0, {}, "Recorded to accompany an animated film of the same name, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>."),
    new Piece("Cold Thoughts", [PIANO], 1978, 98, { pdf: "ColdThoughts.pdf" }, "What's teenhood without a little angst?"),
    new Piece("Communications", [INSTR, FILM], 1988, 95, { soundClick: "12343437" }, "Composed for a <a href=http://sait.ab.ca/ target=_top>SAIT</a> Open House video produced by CTSR students."),
    new Piece("Concert Overture", [ORCH], 1986, 248, {}, "Scored for wind ensemble."),
    new Piece("CTSR March", [INSTR, FILM], 1988, 171, { youtube: "4XSQdegGW2U" }, "Composed for a <a href=http://sait.ab.ca/ target=_top>SAIT</a> Open House video produced by CTSR students."),
    new Piece("Cycling - the Sane Solution", [PIANO, INSTR, FILM], 1989, 55, { youtube: "UmCJGybD68s", pdf: "CyclingSaneSolution.pdf" }, "Written for a 1-minute public service announcement about cycling, and performed on piano and synthesizer. Listen for the scene shifts between the carefree cyclist and the aggravated motorist."),
    new Piece("Dance for Mixolydian Algorithms", [INSTR], 1985, 180, { youtube: "urEusaWFMz4" }, "Scored for RX15 percussion synthesizer, DX7 algorithm synthesizer, and piano."),
    new Piece("Dancing Class (Arrangement)", [ARR, PIANO, VOICE], 2012, 401, { pdf: "DancingClass.pdf" }, "Arrangement of Jane Siberry's piece from her 1984 album <a href=\"http://en.wikipedia.org/wiki/No_Borders_Here\">No Borders Here</a>"),
    new Piece("Dead Loser I", [INSTR, FILM], 1989, 30, { soundClick: "12343438" }, "Background music and sounds for a cocaine abuse PSA."),
    new Piece("Dead Loser II", [INSTR, FILM], 1989, 32, { soundClick: "12348596" }, "Background music and sounds for a cocaine abuse PSA."),
    new Piece("December 5", [INSTR], 1991, 342, {}, "A piece composed upon the dissolution of the U.S.S.R., with sounds which remind me of a desolate Russian winter."),
    new Piece("Delusions", [PIANO, INSTR], 1985, 61, { pdf: "Delusions.pdf" }, "Scored for flute and piano, the piece is very fast and in constantly changing metre. Inspired by King Crimson's <em>Lark's Tongues in Aspic</em>. Playable with piano duet, if you don't happen to have a flute."),
    new Piece("Door to Door", [PIANO, INSTR, FILM], 1996, 94, {}, "An adult animation class project produced by Kevin Kurytnik at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>. Every short film had to start and end with the same image of a door, and the piece is consequently divided into very different sections, joined by a repeating sting, or brief motif. Scored for piano, organ, bass, percussion, and synthesizer."),
    new Piece("Drunk Detective Show Theme", [INSTR, EXP], 2014, 61, { soundCloud: "drunk-detective-show-theme" }, "A one-minute jazz-inspired exercise in 15/16 time: each bar has three beats, each beat having five pulses."),
    new Piece("Eastern Desert Stereotype", [INSTR, FILM], 1991, 201, { youtube: "3PKfg-O7N-g" }, "What the title says. Scored for percussion, bass, flute, and saxophone; recorded with synthesizers."),
    new Piece("Elbow Falls Interlude", [FILM, ORCH], 1996, 159, {}, "Composed for the <B>Broadcast Filler Service</B> to accompany a video of this waterfall."),
    new Piece("Engagement", [INSTR, EXP], 2005, 214, { soundClick: "12343414" }, "Scored for two altos and synthesizer (or bass, guitar, zither, bagpipe, flute, oboe, trumpet, trombone, tuba, marimba, and percussion). A piece exploring alternative rhythms. (The primary time signature is five beats of dash-dotted quarters, and a dotted eighth. See my <a href=placenotation.html>essay on modifications to music notation</a> if you want to know what a dash-dotted quarter is.)"),
    new Piece("Engagement", [INSTR, EXP], 2015, 214, { soundCloud: "engagement" }, "Re-recorded version of Engagement (2005) done on Logic Pro X."),
    new Piece("Evangeline", [PIANO, VOICE, INSTR], 2012, 285, { pdf: "Evangeline.pdf" }, "Words by Sappho Hansen Smythe. Recording scored for voice, flute, french horn, trumpet, percussion, acoustic guitar, bass guitar, piano, and strings; manuscript simplified for voice and piano."),
    new Piece("Evening", [FILM], 1989, 195, { youtube: "TCwBqjwBbIk" }, "Based on a Mozart sonatina; originally composed for the <B>Canadian Cancer Society</B> video <em>BSE For Every Woman</em>."),
    new Piece("Evolution of the Long-Tailed Bird", [INSTR, FILM], 1994, 0, {}, "Recorded to accompany an animated film of the same name, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>."),
    new Piece("Fanfare for Mark", [INSTR], 1983, 4, {}, "Fanfare for three trombones, ending in a chord using deliberately mistuned notes, in honour of the ego and unbridled arrogance of another fellow trombonist, and played upon his arrival."),
    new Piece("Five Jazzy Pieces", [PIANO], 1970, 132, { pdf: "FiveJazzyPieces.pdf" }, "Easy juvenilia."),
    new Piece("FiveBeat", [EXP], 2001, 185, { youtube: "qOntal0Zfok" }, "An experimental work in which each quarter note beat is divided into five equal parts. Notating such time signatures and beats is a bear, unless one uses my <a href=placenotation.html>new modifications to music notation</a>."),
    new Piece("Four to One", [INSTR], 1986, 206, { soundClick: "12370114", pdf: "FourtoOne.pdf" }, "A lullaby for marimba, guitar, and bass."),
    new Piece("Four-track DX7 improvisation in 11/8", [INSTR], 1984, 178, {}, "I dragged my new DX7 into the electronic music lab at the University of Calgary and spent the holidays playing around. (I had no multitracking capability at home.) Unfortunately the original reel-to-reel is lost, so this poor recording comes from an old cassette."),
    new Piece("Four-track DX7 improvisation in 15/8", [INSTR], 1984, 286, {}, "I dragged my new DX7 into the electronic music lab at the University of Calgary and spent the holidays playing around. (I had no multitracking capability at home.) Unfortunately the original reel-to-reel is lost, so this poor recording comes from an old cassette."),
    new Piece("Four-track DX7 improvisation in 4/4", [INSTR], 1984, 233, {}, "I dragged my new DX7 into the electronic music lab at the University of Calgary and spent the holidays playing around. (I had no multitracking capability at home.) Unfortunately the original reel-to-reel is lost, so this poor recording comes from an old cassette."),
    new Piece("Four-track Microcomposer Improv", [EXP], 1984, 231, { mp3: "Microcomposer Improv.mp3" }, "Improvisation on four tracks using Roland MC4 Microcomposer, recorded in the electronic music lab at the U of Calgary. Unfortunately the original reel-to-reel is lost, so this poor recording comes from an old cassette."),
    new Piece("Four-track Soundtrack Improv", [EXP], 1984, 186, { soundClick: "12343540" }, "Moody improvisation on four tracks, recorded in the electronic music lab at the U of Calgary. Unfortunately the original reel-to-reel is lost, so this poor recording comes from an old cassette."),
    new Piece("Four-track Tinuviel Improv", [EXP], 1984, 271, { mp3: "Tinuviel Improv.mp3" }, "Improvisation on four tracks using Roland MC4 Microcomposer looping the ostinato from Tinuviel, recorded in the electronic music lab at the U of Calgary. Unfortunately the original reel-to-reel is lost, so this poor recording comes from an old cassette."),
    new Piece("The Front Door", [PIANO], 1990, 222, { mp3: "The Front Door.mp3" }, "Slow, melancholy. Part of an impromptu suite of pieces, preceded by <em>The Kitchen Stirs At Dawn</em> and followed by <em>Glow in the Rear View Mirror</em>. Unfortunately I lost my original project, so this recording is a poor rendition from an old cassette."),
    new Piece("Fugue for Flute, Violin, and Viola", [INSTR], 1993, 82, { pdf: "FugueFluteViolinViola.pdf" }, "A traditional three-voice fugue demonstrating various common fugal devices, but exhibiting too great a range to be playable on a single keyboard by a single player."),
    new Piece("Fugue in d minor", [PIANO], 1992, 36, { pdf: "FugueInDMinor.pdf" }, "A traditional three-voice fugue written as an exercise, and playable on a keyboard."),
    new Piece("Glow in the Rear View Mirror", [PIANO, INSTR], 1990, 253, { youtube: "UiG3wUnb1Mg", pdf: "GlowRearViewMirror.pdf" }, "Scored for two pianos, recorded on synthesizer. Based on <em>Vignettes</em> by Lee Sebel (a demo piece composed for owners of the Roland W30 Synthesizer). The glow in the title is receding city lights. At one point in the piece you hear the rush of a truck in the opposing lane."),
    new Piece("Greed", [FILM], 1994, 124, { soundClick: "12343456" }, "Recorded to accompany an animated film of the same name by Megan Evans, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>."),
    new Piece("Hansen Smythe Sampler 1991", [INSTR], 1991, 393, { soundClick: "7067916" }, "A spliced-together compilation of 14 pieces for demo purposes."),
    new Piece("Happy Quarks", [INSTR], 1984, 111, { soundClick: "12343443" }, "An early experiment using analog synths and a Roland MC4 Microcomposer (an analog sequencer), plus a Yamaha DX7."), // https://youtu.be/70jSlTZLx8Y
    new Piece("Hellas Planitia National Anthem", [ORCH], 2020, 35, {}, "A credible-sounding national anthem, ready to go when Hellas Planitia, Mars, declares itself a sovereign nation."),
    new Piece("IF, by chance, ENDIF", [EXP], 1996, 0, { html: "scores/IfByChance.html" }, "For any instrument, this is a computer program that runs as a macro in WordPerfect 6.1 or later. The program generates a printout of a monophonic sequence of between 10 and 110 notes, in a time signature between 3/8 and 15/8, with weighted random choices defining each note's pitch and duration."),
    new Piece("In a Timepiece (i.e. Impatience)", [PIANO], 1984, 68, { soundClick: "12367715", pdf: "InaTimepiece.pdf" }, "I couldn't decide on which title I liked better. They're anagrams of each other."),
    new Piece("Inner Garden I (Arrangement)", [ARR, PIANO, VOICE], 2015, 100, { pdf: "InnerGardenI.pdf" }, "Arrangement of King Crimson's piece from their 1995 album <a href=\"http://en.wikipedia.org/wiki/Thrak\">Thrak</a>"),
    new Piece("Inner Garden II (Arrangement)", [ARR, PIANO, VOICE], 2015, 70, { pdf: "InnerGardenII.pdf" }, "Arrangement of King Crimson's piece from their 1995 album <a href=\"http://en.wikipedia.org/wiki/Thrak\">Thrak</a>"),
    new Piece("Invention in B Minor", [PIANO], 1992, 88, { pdf: "InventionInBMinor.pdf" }, "Composed as an exercise in part writing, the theme is invertible at the octave, and modulates into the relative major in the middle section, before being chopped up in dominant preparation. I think it would sound good played by viola and 'cello."),
    new Piece("Invention in E Minor", [PIANO], 1992, 0, { pdf: "InventionInEMinor.pdf" }, "Composed as a two-voice exercise in part writing."),
    new Piece("Invention in D Major for Flute and Viola", [INSTR], 1997, 75, { pdf: "InventionInDMajor.pdf" }, "Originally composed as an exercise in part writing in 1992, the piece was expanded and developed in 1997 as a wedding present for friends who played flute and viola."),
    new Piece("Invention in Seven", [PIANO], 1992, 36, { pdf: "InventionIn7.pdf" }, "Composed as an exercise in part writing. Sounds traditional but for the 7/8 time signature. Published 2011 in <U>Northern Lights, An exploration of Canadian Piano Music</U>, Level 7 Musical Discoveries"),
    new Piece("It's All About Friends", [VOICE, PIANO, THEATRE], 2010, 111, { soundClick: "10303770", pdf: "ItsAllAboutFriends.pdf" }, "Performed by Steve and Sappho Hansen Smythe. The penultimate song from the children's musical by Kathy Macovichuk, \"The Princess and the Pea\". Princess Madeline tests Prince Roderick to see if he'd make a good friend for her. He has all the right answers, and she concludes that she's made a new friend."),
    new Piece("It's All About Me", [VOICE, PIANO, THEATRE], 2010, 138, { soundClick: "9823011", pdf: "ItsAllAboutMe.pdf" }, "Performed by Steve and Sappho Hansen Smythe. The second song from the children's musical by Kathy Macovichuk, \"The Princess and the Pea\". Lady London, Sir Anthony, and Sir Champ, all selfish people who are trying to ingratiate themselves with Prince Roderick, proclaim their egomania, while the royal family tries to convince them that this strategy is unsound."),
    new Piece("Jam", [FILM], 1994, 0, {}, "Produced my own animated film at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>, entitled <CITE>Jam</CITE>, with soundtrack consisting mainly of sampled mouth noises. It was shown along with other animated films from Calgary in May 1996 at the Metro Cinema in Edmonton. I recognize that the film itself is not a composition <em>per se</em>, but the soundtrack is, so there!"),
    new Piece("Journalism", [FILM], 1988, 101, { soundClick: "12343447" }, "Composed for a <a href=http://sait.ab.ca/ target=_top>SAIT</a> Open House video produced by CTSR students."),
    new Piece("Khazad-D&ucirc;m", [PIANO], 1977, 110, { soundClick: "11177859", pdf: "KhazadDum.pdf" }, "Scored for two pianos. Inspired by the dwarves' mines and metalworking caves in Moria, described in Tolkien's \"Lord of the Rings\". Won the Alberta and Canadian Registered Music Teachers' composition competitions in 1977."),
    new Piece("King Arthur Fanfare", [THEATRE], 1990, 37, { soundClick: "12348571" }, "Fanfare for brass and percussion for <B>Storybook Theatre</B>'s production of <Q>Arthur and the Knights of the Round Table</Q>."),
    new Piece("The Kitchen Stirs at Dawn", [INSTR], 1990, 253, { youtube: "VtxXru-l5oU" }, "A piece written for an imaginary animated film featuring a kitchen preparing breakfast, and an increasingly insistent alarm clock trying to get its owner out of bed."),
    new Piece("The Last Flower", [PIANO], 1979, 120, { pdf: "LastFlower.pdf" }, "Composed to accompany the skit of the same name in <em>A Thurber Carnival</em> by James Thurber, performed by my high school drama department."),
    new Piece("Les Pingoins Explorent/The Exploring Penguins I", [FILM], 1990, 61, { soundClick: "12343441" }, "Music and sounds for the first of two versions of the animated film of the same name, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>."),
    new Piece("Les Pingoins Explorent/The Exploring Penguins II", [FILM], 1991, 121, { soundClick: "12348568" }, "Music and sounds for the second of two versions of the animated film of the same name, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>."),
    new Piece("Level Up (Arrangement)", [ARR, VOICE, PIANO, INSTR], 2014, 229, { soundCloud: "level-up-cover", pdf: "LevelUp.pdf" }, "Arrangement of Vienna Teng's piece, <a href=\"http://viennateng.bandcamp.com/track/level-up\">Level Up</a>, from her 2013 album <a href=\"http://viennateng.bandcamp.com/album/aims\">Aims</a>. Scored for two altos, grand piano, violin, trombone, and tin whistle."),
    new Piece("Level Up (Arrangement in A major)", [ARR, VOICE, PIANO, INSTR], 2021, 225, { youtube: "qBMDbbDYM7c", pdf: "LevelUpA.pdf" }, "Arrangement and transposition of Vienna Teng's piece, <a href=\"http://viennateng.bandcamp.com/track/level-up\">Level Up</a>, from her 2013 album <a href=\"http://viennateng.bandcamp.com/album/aims\">Aims</a>. Scored for tenor, baritone, grand piano, synthesizer, two trombones, and tin whistle."),
    new Piece("Library Technology", [FILM], 1988, 77, { soundClick: "12343448" }, "Composed for a <a href=http://sait.ab.ca/ target=_top>SAIT</a> Open House video produced by CTSR students."),
    new Piece("Life Symphony", [ORCH], 1996, 1500, { pdf: "LifeSymphony.pdf" }, "For any number of instrumentalists, the more the merrier. My most philosophically important work. Dedicated to Stephen Jay Gould. Five movements delimited by various biorevolutions (emergence of life, oxygen-releasing photosynthesis, multicellular life, colonization of land), aleatorically tracing the history of life at a ratio of 3 million years per second. Commissioned by the <B>Alberta Heritage Foundation for Medical Research</B>. Reorganized and rescored September 2006."),
    new Piece("Little Mermaid", [INSTR], 1984, 138, { soundClick: "12343449" }, "Scored for synthesizer or guitar, strings, koto, and vibes. The first 27 seconds was composed by Kristal Calvert for a children's opera; I composed the remaining material."),
    new Piece("Madeline's Lullaby", [VOICE, PIANO, THEATRE], 2010, 79, { soundClick: "9823010", pdf: "MadelinesLullaby.pdf" }, "Performed by Steve and Sappho Hansen Smythe. The middle song from the children's musical by Kathy Macovichuk, \"The Princess and the Pea\". Princess Madeline is having a tough time falling asleep on that pile of mattresses, and sings herself this lullaby."),
    new Piece("The Magnificat!", [FILM, ORCH], 2013, 312, { soundClick: "12336217" }, "Soundtrack to the <a href='http://youtu.be/FgoEcIAsXfs'>YouTube video</a> of the same name by I. H. Smythe."),
    new Piece("Making Friends", [VOICE, PIANO, THEATRE], 2010, 167, { soundClick: "9823009", pdf: "MakingFriends.pdf" }, "Performed by Steve and Sappho Hansen Smythe. The closing song from the children's musical by Kathy Macovichuk, \"The Princess and the Pea\". The entire cast rehashes the characters and the moral, concluding that the best strategy for social interaction is to be nice."),
    new Piece("March of the Recursive Satirists", [INSTR], 1990, 368, {}, "A version of work composed for Esso Resources Canada Limited, which itself was a redo of a theme composed for an early computer game. I had only two tracks with which to work, so bass doubled as percussion."),
    new Piece("Meedra Ma", [FILM], 1994, 38, { soundClick: "12348570" }, "Scored for piano and bass; composed to accompany an animated film of the same name, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>."),
    new Piece("Modal Variations", [PIANO], 2000, 840, { musicaneo: "sm-45598_modal_variations" }, "Seven piano variations in seven modes. The tonic of each variation descends from the previous one by step, and the key signature of each has one fewer sharps than the previous one. Time signature loosely corresponds to the number of the mode."),
    new Piece("Mope's Song", [VOICE, PIANO, THEATRE], 1983, 98, { pdf: "MopesSong.pdf" }, "Scored for tenor and either piano or guitar and bass (composed for<em> The Girl With The Expressive Eyebrows</em>, words by Charles Costello)"),
    new Piece("Morning", [FILM], 1989, 176, { youtube: "Qt64Jvl-_RY" }, "Based on a Mozart sonatina; originally composed for the <B>Canadian Cancer Society</B> video <em>BSE For Every Woman</em>."),
    new Piece("Nana's Song", [VOICE, PIANO, THEATRE], 2008, 145, { pdf: "NanasSong.pdf" }, "Music for Kathy Macovichuk's play 'The Littlest Pirate', winner of the 2009 Robert C. Hayes award."),
    new Piece("New Horizons", [VOICE, PIANO, THEATRE], 2010, 127, { soundClick: "9823012", pdf: "NewHorizons.pdf" }, "Performed by Steve and Sappho Hansen Smythe. The opening song from the children's musical by Kathy Macovichuk, \"The Princess and the Pea\". Prince Roderick is sad that he's had to move, and he's missing his old friends. His mother and the blokes from the moving company assure him, in song, that it'll be OK."),
    new Piece("O Canada Ragtime", [ORCH], 1990, 76, { youtube: "ZlgNpsD9bpU" }, "A playful rendition of Canada's national anthem. Scored for orchestra and ragtime pick-up band; recorded with synthesizers. The only one of my compositions to make it onto the Low Budget Radio  <a href=http://www.lowbudgetradio.com/ratearecord.html>Listener's Choice ballot</a> for 2005, where it came in 366th, being narrowly beat out by Stompin' Tom Connors The Man In The Moon Is A Newfie in 364th place, but beating out such classics as Pepe The Purple Platypus by Squish and the Pregnant Elephants. Go figure."),
    new Piece("Of Aragorn", [PIANO, VOICE], 1983, 81, { pdf: "OfAragorn.pdf" }, "Scored for soprano and piano, words by J.R.R. Tolkien."),
    new Piece("Oh Lord, It's Hard To Play Country", [VOICE, INSTR], 1984, 64, { pdf: "HardToPlayCountry.pdf" }, "Scored for twangy country voice, guitar, bass, and snare drum."),
    new Piece("The Old Country Dance", [PIANO], 1969, 0,{ pdf: "OldCountryDance.pdf" }, "The first piece I composed that I actually think is good."),
    new Piece("Paranoid Androids", [INSTR], 1990, 238, { youtube: "e722yPkISWQ" }, "I used the weird over-compressed end of a normal electric piano sample as a percussion instrument, and added wailing dischords. We danced around listening to it over and over the day I first recorded it."),
    new Piece("Physics and the Art of Meditation", [INSTR], 1990, 3000, {}, "Music by which to meditate, or watch <a href=\"http://flippingartgallery.com\">great art by Erica Neumann</a>!  The title is a joke. Has nothing to do with physics. Whipped up in time to sell cassettes at a science fiction/fantasy convention, and sales were satisfyingly brisk. Side one of the cassette was wet with water sounds, and side two was dry with crickets and percussion."),
    new Piece("Piece for DX7 and Piano", [PIANO, INSTR], 1985, 204, { pdf: "PieceforPianoandDX7.pdf" }, "Performed by Steve Hansen Smythe and George Fenwick, some recital hour at the U of C."),
    new Piece("Pirate Song", [VOICE, PIANO, THEATRE], 2008, 95, { pdf: "PirateSong.pdf" }, "Music for Kathy Macovichuk's play 'The Littlest Pirate', winner of the 2009 Robert C. Hayes award."),
    new Piece("Premonition", [VOICE, INSTR], 1983, 0, {}, "Scored for four men's voices, clarinet, marimba, wind chimes (based on the poem by the same name by Robert W. Service)."),
    new Piece("Prime Brass", [INSTR], 1982, 221, { soundClick: "12349499", pdf: "PrimeBrass.pdf" }, "Scored for Trumpet, French horn, and Trombone. Every time signature is prime, there are a prime number of instruments, a prime number of bars in each section, and a prime number of 8th note beats in the entire piece."),
    new Piece("Print Technology", [FILM], 1988, 85, { soundClick: "12343450" }, "Composed for a <a href=http://sait.ab.ca/ target=_top>SAIT</a> Open House video produced by CTSR students."),
    new Piece("Quality Time", [FILM], 1994, 0, { soundClick: "12343452" }, "Recorded to accompany an animated film of the same name, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>."),
    new Piece("RandoMIDI", [EXP], 2005, 0, {}, "Java applet which plays pseudo-random phrases on your computer's sound card. I didn't maintain this code, so it's no longer available."),
    new Piece("Rose the Cat interprets Psalm 23", [FILM, ORCH], 2012, 262, { soundClick: "11894926" }, "Soundtrack to the <a href=\"http://youtu.be/UF4eW4WA4bM\">YouTube video</a> of the same name, by I. H. Smythe."),
    new Piece("The Saamis I", [FILM], 1989, 25, { soundClick: "12343457" }, "Themes and stings composed for a CTSR radio play of the same name. The radio play which this music accompanies, The Saamis, was about how the town of Medicine Hat came to get its name. It dramatized three different versions of a Native American story."),
    new Piece("The Saamis II", [FILM], 1989, 71, { soundClick: "12343458" }, "Themes and stings composed for a CTSR radio play of the same name. The radio play which this music accompanies, The Saamis, was about how the town of Medicine Hat came to get its name. It dramatized three different versions of a Native American story."),
    new Piece("The Saamis III", [FILM], 1989, 29, { soundClick: "12343459" }, "Themes and stings composed for a CTSR radio play of the same name. The radio play which this music accompanies, The Saamis, was about how the town of Medicine Hat came to get its name. It dramatized three different versions of a Native American story."),
    new Piece("The Saamis IV", [FILM], 1989, 27, { soundClick: "12343460" }, "Themes and stings composed for a CTSR radio play of the same name. The radio play which this music accompanies, The Saamis, was about how the town of Medicine Hat came to get its name. It dramatized three different versions of a Native American story."),
    new Piece("Scuba Siv", [FILM], 1994, 0, {}, "Two versions of this music were composed for two versions of Don Filipchuk's animated film of the same name, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>."),
    new Piece("Setting Traps for Santa", [VOICE, PIANO], 2004, 338, {}, "Lyrics by Ingrid Hansen Smythe, music by Steve. A funny Christmas song."),
    new Piece("Seven-spheres", [EXP], 1985, 0, {}, "An attempt to create music by constantly varying the timbre of the sound through seven instrumental sounds, while chords changed slowly through a 35-bar pattern."),
    new Piece("A Short String Thing", [INSTR], 1983, 62, { pdf: "ShortStringThing.pdf" }, "Scored for string quartet. Time signature a fast 11/8."),
    new Piece("Siv Polka", [FILM], 1998, 49, { youtube: "eeJwf6THfnI" }, "Scored for solo accordion. Composed and recorded for Don Filipchuk's animated film, <B>Vacuum Siv</B>, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A."),
    new Piece("Siv Tango", [FILM], 1998, 71, { youtube: "uA4JxAdt3XM" }, "Scored for accordion, bass, and shaker. Composed and recorded for Don Filipchuk's animated film, <B>Vacuum Siv</B>, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</A."),
    new Piece("Six, Five", [PIANO, INSTR], 1998, 171, { youtube: "13tYSMfNJuY" }, "Piano duet in varying metre (take a guess from the title), originally scored for synthesizer."),
    new Piece("Sleeping", [PIANO], 1970, 60, { pdf: "Sleeping.pdf" }, "Easy juvenilia."),
    new Piece("Sonata for Violin and Piano", [PIANO, INSTR], 1986, 0, {}, "First and second movements only, and never finished. An Experiment with non-standard scales."),
    new Piece("Space Promotion Anthem", [VOICE], 1998, 66, { pdf: "SpaceAnthem.pdf" }, "Word got around, in the space activist community, that what we really needed was a rousing anthem, and that if only we'd sing together in mutual harmony and understanding, the rockets would go up and the solar power satellites would get built. This is my attempt, using Alexander Courage's opening theme from Star Trek as the cantus firmus (and that's not easy!), and appropriately international Esperanto lyrics by my mother, Jean Smythe:<P style=\"font-style:italic\">En la kosmon baldau voja&#285;os ni!<br>Revojn esperplene plenumos ni.<br>Antaen, eksteren, kaj supren ni flugos del' Tero, por<br>fondi novmondon, ja estas la ceelo.</P><P style=\"font-style:italic\">Vidu, jen atendas nin nia &#265;ar'!<br>Sidu, a ventureema kolegar'!<br>Pezofortego ense&#285;en nin premas, travibras<br>ekscito, pro fora voja&#285;o al nova hejm'!</P><P style=\"font-style:italic\">Fore en la spacurbo lo&#285;os ni!<br>novdefiojn sa&#285;e forvenkos ni!<br>Tiam laboros ni &#265;iuj por kuna boneco, kaj<br>Forte konstruos sunpotencigiilon.</P><P>Loosely translated, with no attempt to capture poetry:</P><P>We will soon travel into space!<br>Hopefully we will fulfill our dreams.<br>Onward, outward, and upward we will fly from Earth<br>to found a new world: it is the sky, after all.</P><P>Look, here our vehicle waits for us!<br>Sit down, adventurous colleague!<br>A heavy weight presses down on us,<br>excitement shines through a long journey to a new home!</P><P>We will live away in the space city!<br>We will overcome new challenges!<br>Then we will all work for a common good,<br>and build a mighty solar power plant.</P>"),
    new Piece("Stardrift", [PIANO], 1976, 185, { pdf: "Stardrift.pdf" }, "Won first in Calgary and Alberta Kiwanis Festivals, and first in the Alberta Registered Music Teachers' Composition Competition."),
    new Piece("Stinky Pete's Song", [VOICE, PIANO, THEATRE], 2008, 111, { pdf: "StinkyPetesSong.pdf" }, "Music for Kathy Macovichuk's play 'The Littlest Pirate', winner of the 2009 Robert C. Hayes award."),
    new Piece("Suit Fugue (Dance of the A&R Men)", [ARR, VOICE], 2000, 144, { pdf: "SuitFugue.pdf" }, "Transcription of Kevin Gilbert's canon for four voices from his album 'The Shaming of the True'"),
    new Piece("Sundayalysis", [EXP], 1993, 316, { youtube: "z014zrEOASg" }, "A decomposition of sound samples all taken one Sunday morning, featuring the Gregorian Chant Choir of Calgary (in which I sang), and sounds from the tower bells of Christ Church, Elbow Park, where I have rung bells off and on for 25 years."),
    new Piece("A Synthesized Minute", [INSTR], 2013, 56, { soundClick: "12377268" }, "Just playing around with analog synth sounds for a minute."),
    new Piece("Takakkaw Falls", [FILM, ORCH], 2009, 250, { soundClick: "8222135", musicaneo: "sm-43504_takakkaw_falls" }, "Performed by Westmount Charter School's Senior Orchestra in June 2010. A simpler version of this piece was composed in 1996 for the <B>Broadcast Filler Service</B> to accompany a video of this waterfall."),
    new Piece("Takakkaw Falls", [PIANO], 2019, 250, { pdf: "Takakkaw Falls Piano Duet.pdf" }, "Piano duet (one piano, four hands) arrangement of the orchestral version."),
    new Piece("The Tale of Tinuviel", [VOICE, PIANO, INSTR], 1980, 0, {}, "Scored for tenor and piano or folk instruments (words by J.R.R. Tolkien)"),
    new Piece("Tangle Creek Interlude", [FILM, ORCH], 1996, 261, { soundClick: "12347854" }, "Scored for orchestra and piano. Composed for the <B>Broadcast Filler Service</B> to accompany a video of this creek."),
    new Piece("Telephone Answering Machine Message", [VOICE], 1980, 0,{ pdf: "TelephoneAnsweringMachineMessage.pdf" }, "Scored for four men's voices."),
    new Piece("Theme and Variations", [PIANO], 1984, 295, { soundClick: "11384708", musicaneo: "sm-85472_theme_and_variations.html" }, "Revised in 1987, intermediate difficulty. Theme and five variations, based on two 12-tone rows generated by a program in Basic running on a Timex Sinclair ZX81 computer. Performed by Gordon Rumson in concert in 1994."),
    new Piece("Theory Student Electro Shock Collar", [VOICE, INSTR], 1993, 45, { soundClick: "12343440" }, "An imaginary radio advertisement for a really useful product - if you're a music theory teacher."),
    new Piece("Thirteen Elephants I & II", [INSTR], 1984, 69, { soundClick: "12343454" }, "Two synthesized versions of the second variation of the Theme and Variations."),
    new Piece("Tigger", [PIANO, THEATRE], 1997, 34, { pdf: "Tigger.pdf" }, "A short version of music originally composed for Storybook Theatre's production of <em>A House At Pooh Corner</em>. It's harder than it sounds. The performer may <em>ad libitum</em> twang a metal or plastic ruler against the piano on each 8th note rest."),
    new Piece("Train Variations", [PIANO], 2005, 614, { html: "http://www.cncm.ca/making-tracks.html" }, "A suite of seven variations, co-written with Gordon Rumson, using three Russion folk songs. Each of us composed one part of some of the seven variations, then passed the piece on to the other, who composed the missing part. The variations are a metaphor for a train journey across Russia, starting with a View of Japan and ending as the train arrives in Moscow with Bells of Mother Russia. Published in <Q>Making Tracks Vol. 3</Q> by Canadian National Conservatory of Music."),
    new Piece("Type A", [FILM, INSTR], 2006, 112, { youtube: "yfzNxcvBAY4" }, "Recorded to accompany an animated film of the same name by Ray Smith, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>. Scored for piano, guitar, bass, drums, strings, xylophone. and typewriter. The film follows a type A character who has difficulty with a computer, a typewriter, and eventually even a pencil."),
    new Piece("Unstoppable", [PIANO], 1998, 103, { pdf: "Unstoppable.pdf" }, "Scored for piano, intermediate difficulty, phrygian mode. Also scored as a string quartet. I used some of the same thematic material for the soundtrack to an animated film, <B>Type A</B>, by Ray Smith, produced at <a href=https://quickdrawanimation.ca/ target=_top>Quickdraw Animation Society</a>."),
    new Piece("Unstoppable", [INSTR], 1998, 103, { pdf: "UnstoppableStrings.pdf" }, "Scored for string quartet, intermediate difficulty, phrygian mode. Also scored for piano solo."),
    new Piece("Waiting (Arrangement)", [ARR, PIANO, VOICE], 2012, 270, { pdf: "Waiting.pdf" }, "Arrangement of Kevin Gilbert's piece from his 1995 album <a href=\"http://en.wikipedia.org/wiki/Live_at_the_Troubadour_(Kevin_Gilbert_%26_Thud)\">Welcome to Joytown - Thud: Live at the Troubadour</a>"),
    new Piece("We Will All Go Together When We Go (Covid-19 version)", [PIANO, VOICE], 2020, 115, { youtube: "e9ePpPNpY_8" }, "Tom Lehrer's immortal song about everyone dying in a nuclear war, reimagined for Covid-19"),
    new Piece("Wendy", [PIANO, VOICE], 1979, 90, { pdf: "Wendy.pdf" }, "Scored for piano and cracking testosterone-laden baritone, or flute (words, embarrassingly, by me)"),
    new Piece("While Walking", [PIANO], 1985, 262, { soundClick: "11353195", musicaneo: "sm-85627_while_walking" }, "An easy piece so long as you have big hands, having an improvisatory feel. Reading the score is difficult not because the notes are hard to play, but that standard notation does not deal well with chords built up a note at a time."),
    new Piece("Willowind", [PIANO], 1974, 88, { pdf: "Willowind.pdf" }, "Easy juvenilia, using Beethoven's F&uuml;r Elise for thematic inspiration. Shared first place at Calgary Kiwanis music festival."),
    new Piece("Zig Zag", [PIANO], 2011, 103, { pdf: "ZigZag.pdf" }, "This piece requires a lot of movement of the left hand, and consecutive fifths in the right. The modal sound is achieved mainly by using the subtonic (the note a whole tone below the tonic) rather than the leading note.")
];
