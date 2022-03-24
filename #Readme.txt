


			88888888888            888          
			    888                888          
			    888                888          
			    888   .d88b.   .d88888  .d88b.  
			    888  d88""88b d88" 888 d88""88b 
			    888  888  888 888  888 888  888 
			    888  Y88..88P Y88b 888 Y88..88P 
			    888   "Y88P"   "Y88888  "Y88P"  



#############################################################################
07/02/2022 16:07 
  TD When I've found the time to compile charts lately it has been a manual process -- most arduous! -- 
     but for the most part I have simply not been compiling my weekly charts, and that's not good. 
     I compile & post the weeklies so that artists get the recognition they deserve via the NACC radio chart & social media posts.
     If you have the time & inclination to work with me further on this, I have found a way to export data from my playback software.
   
     It's not ideal for me because it does not include listener counts,
     however it does produce much cleaner data including album titles,
     which was missing from the previous data & something I really need.
   
     The biggest issue I've yet to overcome is that I tried to filter out the Station IDs 
    (when bands introduce themselves, when listeners say hi, recordings of my callbacks during reruns)
     but some continue to sneak in.
     
     Those IDs all have the Artist Name & Album Name of "ID/PSA" so they should be pretty easy to filter out of the results.
     In case you decide to give this a try I have included last week's data in TSV (Apple Numbers) & CSV formats.
     
     A script or webapp (like the ChartCruncher™) that can turn this type of data into numbered lists of Songs by Plays & Albums by Plays would be fabulous.
    
     To make it useful for both the air play charts I report weekly & for my year-end charts
     it would be great if I could select how long those lists would be
     (ie for weekly a top 50 songs & top 50 albums by spins would be ideal, 
     whereas for the year a top 500 of each would be best. 
    
     And because I don't know to quit while I'm ahead...by including the Year data I hope it would be possible for the year-end charts to filter
     out any entries that are not either <current year> or <current year -1> 
     so that records that came out late in the prior year (or records that I just plain missed when they first dropped) can be included.


#############################################################################






			8888888b.                             
			888  "Y88b                            
			888    888                            
			888    888  .d88b.  88888b.   .d88b.  
			888    888 d88""88b 888 "88b d8P  Y8b 
			888    888 888  888 888  888 88888888 
			888  .d88P Y88..88P 888  888 Y8b.     
			8888888P"   "Y88P"  888  888  "Y8888  


#############################################################################
25/02/2022 16:30 Enviei email
  RQ Hey Ted
     I had some free time now and started looking at this issue
     Few questions
      1) what is the structure of the file that will be consumed by this app ?
         I ask you this because the strucure of the file you just sent me is this
            Title	Artist	Album	Year	Plays	;
         but the one you've sent me last December is this one      
           NAME OF SERVICE	TRANSMISSION CATEGORY	FEATURED ARTIST	SOUND RECORDING TITLE	ALBUM TITLE	MARKETING LABEL	ISRC	ACTUAL TOTAL PERFORMANCES	PLAY FREQUENCY
         so my question is: which one should we consider from now on ?

     2) I see that the file you've sent me is comma delimited.
        the problem is that some data has commas too... which makes it hard (if not impossible) for the app to understand in which column does the data belong.
        For example your file has this one:
          Farewell, OK,Elvis Costello & The Imposters,The Boy Named If,2022,11,;
        the app will end up doing something like this
         Title: Farewell
         Artist: OK
         Album: Elvis Costello & The Imposters
         Year: The Boy Named If
         Plays: 2022
         etc...

       Do you have any other export formats we can try with ?
       For example, tab-delimited ?
       Btw, in case you're interested we could setup a zoom meeting to discuss these details 
       and make these interactions run faster and more productive.
       Let me know
       Cheers.
---------------------------------------------------------------------------
07/03/2022 21:10 
  TD The new format. 
     Forget about the old format. 
  RQ ok. no problem with that

  TD but this cleaner format should make everything simpler. 
     Is that assumption correct? 
  RQ yes that is correct. but we still need to find a way to split the data by fields correctly. See my point 2) below.
     the fact that we might have an album (or an artist) with "," on its content... it will become impossible to clearly identify what is content, and what is end of field/column
     know what I mean ?

  TD The recent new format report I sent is a weekly, will the ChartCruncher be able to handle data from 
     larger (monthly, yearly, multi-yearly) date ranges?
  RQ I think so. but we'll have to test. last time I tried with a massive file of 8MB with more than 80k records... 
     and the app behaved rather well (took around 5seconds to chew all that)
---------------------------------------------------------------------------


#############################################################################
