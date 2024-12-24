import achu from '../../assets/Influencers/Achu.png'
import bellie from '../../assets/Influencers/bellie.png'
import helen from '../../assets/Influencers/helen.png'
import keira from '../../assets/Influencers/keira.png'
import lilly from '../../assets/Influencers/lilly.png'

const users= [
    {
        id:1,
        name: "Achu",
        popular: "75M",
        img:achu,
        messages: [
            { text: "hey", sender: "ai", timestamp: new Date().toISOString() },
            { text: "hi, how are you?", sender: "user", timestamp: new Date().toISOString() }
        ],
        unread:4,
        verified: true
    },
    {
        id:2,
        name: "bellie",
        popular: "Ai influencer",
        img:bellie,
        messages: [
            { text: "hai", sender: "ai", timestamp: new Date().toISOString() },
            { text: "hello there!", sender: "user", timestamp: new Date().toISOString() }
        ],
        unread:6,
        verified: true
    },
    {
        id:3,
        name: "helen",
        popular: "Ai influencer",
        img:helen,
        unread:9
    },
    {
        id:4,
        name: "Sriya",
        popular: "Ai influencer",
        img:keira,
        messages: [
            { text: "evdeya??", sender: "ai", timestamp: new Date().toISOString() },
            { text: "I'm not home right now.", sender: "user", timestamp: new Date().toISOString() }
        ],
        unread:43,
        verified: false
    },
    {
        id:5,
        name: "lilly",
        popular: "Ai influencer",
        img:lilly,
        messages: [
            { text: "call me", sender: "ai", timestamp: new Date().toISOString() },
            { text: "Will do!", sender: "user", timestamp: new Date().toISOString() }
        ],
        unread:2,
        verified: false
    },
]

export default users;