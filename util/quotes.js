var quotes = [
    `"Well, now everything is back as it was. And if history doesn't care that
 our degenerate friend Fry is his own grandfather, then who are we to
 judge?"
                    -Professor Farnsworth`,

    `"Full price for gum?! That dog won't hunt, Monsignor."
                    -Fry`,

    `"My old life wasn't as glamorous as my webpage made it look."
                    -Leela`,

    `"With my last breath, I curse Zoidberg!"
                    -Professor Farnsworth`,

    `Bender: Fry! Stop interfering with history! I don't wanna have to
    memorise a lot of new kings when I get back!
Fry: I had no choice. I was about to not exist. I could feel myself fading
    away, like Greg Kinnear.`,

    `"But that's not why people watch TV. Clever things make people feel
 stupid, and unexpected things make them feel scared."
                    -Fry`,

    `"Why can't she just drink herself happy like everyone else?"
                    -Bender`,

    `"Well, in those days Mars was just a dreary uninhabitable wasteland...
 much like Utah. But unlike Utah, it was eventually made livable..."
                    -Professor Farnsworth`,

    `"That's it! I'm gonna deliver a gift of my boot up Santa's chimney!"
                    -Fry`,

    `"Bodies are for hookers and fat people!"
                    -Bender`,

    `"I'm gonna drink 'til I reboot!"
                    -Bender`,

    `"Fry, he opened up relations with China. He doesn't want to hear about
 your ding-dong."
                    -Leela`,

    `"1947 can kiss my shiny metal..."
                    -Bender`,

    `"Aw, he looks like a little, insane, drunken angel."
                    -Amy`,


    `"Now, be careful, Fry. And if you kill anyone, make sure to eat their
 heart to gain their courage. Their rich, tasty courage."
                    -Professor Farnsworth`,

    `"Is he dumb or just ugly?"
                    -Bender`,

    `Fry: Heya, Bender, what are we doing in this bad neighborhood?
Bender: Shut up, square!`,

    `"Pine trees have been extinct for eight hundred years, Fry. Gone the way
 of the poodle and your primitive notions of modesty."
                    -Professor Farnsworth`,

    `"I'm the first one to work, a new low."
                    -Bender`,

    `"And once I'm swept into office, I'll sell our children's organs to zoos
 for meat, and go into people's houses and wreck up the place!"
                    -Nixon`,

    `"Surrender your mysteries to Zoidberg!"
                    -Zoidberg`,

    `"Sold your body?!  Oh, Bender, I've been down that road. I know it's
glamorous and the parties are great, but you'll end up spending every
dollar you make on jewelry and skintight pants."
                    -Professor Farnsworth`,

    `Hermes: And as a further cost cutting measure, I have eliminted the
        salt-water cooler.
Zoidberg: This is a witch hunt!`,

    `"The point is, by my standards, I won fair and square."
                    -Bender`,

    `"If only he had joined a mainstream religion like Oprahism or Voodoo."
                    -Professor Farnsworth`,

    `"This wangs chung!"
                    -Leela`,


    `"Choke on that, causality!"
                    -Professor Farnsworth`,

    `"Nixon with charisma? My God! I can rule the universe!"`,


    `"Quit squawking, fleshwad!"
                    -Bender`,

    `"Morbo congratulates our gargantuan cyborg president. May death come
 quickly to his enemies!"
                    -Morbo`,

    `"Bender! Quit giving the slave drivers pointers."
                    -Leela`,


    `"I wanna enlist. My friends always die if I'm not there to save them."
                    -Leela`,

    `"This concept of 'wuv' confuses and infuriates us!"
                    -Lurr`,


    `"Bender, you should be more ashamed of yourself than usual!"
                    -Amy`,

    `"You've succeeded in convincing me life is worth living. By showing how
 bad my funeral will suck!"
                    -Bender`,

    `"Wow! Check out that guy! He makes Speedy Gonzales look like regular
 Gonzales."
                    -Fry`,

    `"That bloodthirsty cadaver junkie can't touch us so long as we're not
 stupid enough to leave this building."
                    -Professor Farnsworth`,

    `"'Blackmail' is such an ugly word. I prefer 'extortion.' The 'X' makes it
 sound cool."
                    -Bender`,

    `"Something's wrong. Murder isn't working and that's all we're good at."
                    -Nichelle Nichols`,

    `"Mumbo, perhaps. Jumbo, perhaps not!"`,

    `"Up wherever your species traditionally crams things!"
                    -Hermes`,

    `"I never thought it would end this way, gunned down by Santa Claus."
                    -Fry`,

    `"I like having her around because she's the same blood type as me."
                    -Professor Farnsworth`,

    `"All civilization is just an effort to impress the opposite sex."`

]
function randomQuote(){
  var rand = Math.floor((Math.random() * quotes.length) + 0);
  return quotes[rand];
}

module.exports = {randomQuote}
