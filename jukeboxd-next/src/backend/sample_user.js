import { db } from "./firebaseConfig";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";

// Function to add sample users
const addSampleUsers = async () => {
    const users = [
        {
            user_id: "user1",
            username: "musicfan123",
            email: "musicfan123@example.com",
            profile_picture: "https://example.com/pic1.jpg",
            created_at: new Date()
        },
        {
            user_id: "user2",
            username: "rocklover",
            email: "rocklover@example.com",
            profile_picture: "https://example.com/pic2.jpg",
            created_at: new Date()
        }
    ];

    for (let user of users) {
        await setDoc(doc(db, "users", user.user_id), user);
    }
};

// Function to add a sample song
const addSampleSong = async () => {
    const song = {
        song_id: "song1",
        title: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        album_cover: "https://example.com/bohemian.jpg",
        genre: "Rock",
        release_date: "1975-10-31",
        average_rating: 4.8,
        total_reviews: 2
    };

    await setDoc(doc(db, "songs", song.song_id), song);
};

// Function to add sample reviews
const addSampleReviews = async () => {
    const reviews = [
        {
            review_id: "review1",
            user_id: "user1",
            song_id: "song1",
            rating: 5,
            review_text: "An absolute masterpiece! One of the greatest songs ever written.",
            likes: 3,
            dislikes: 0,
            created_at: new Date()
        },
        {
            review_id: "review2",
            user_id: "user2",
            song_id: "song1",
            rating: 4,
            review_text: "Great song, but a bit overplayed. Still a classic though!",
            likes: 1,
            dislikes: 1,
            created_at: new Date()
        }
    ];

    for (let review of reviews) {
        await setDoc(doc(db, "reviews", review.review_id), review);
    }
};

// Function to add sample comments
const addSampleComments = async () => {
    const comments = [
        {
            comment_id: "comment1",
            review_id: "review1",
            user_id: "user2",
            comment_text: "Totally agree! The operatic section is legendary.",
            likes: 2,
            dislikes: 0,
            created_at: new Date()
        },
        {
            comment_id: "comment2",
            review_id: "review2",
            user_id: "user1",
            comment_text: "I get what you mean, but that just shows its impact!",
            likes: 1,
            dislikes: 0,
            created_at: new Date()
        }
    ];

    for (let comment of comments) {
        await setDoc(doc(db, "comments", comment.comment_id), comment);
    }
};

// Run all functions
const seedDatabase = async () => {
    await addSampleUsers();
    await addSampleSong();
    await addSampleReviews();
    await addSampleComments();
    console.log("Sample data added successfully!");
};

seedDatabase();
