export const mockDatabase = {
  users: [
    { id: 'user1', username: 'musicfan123', email: 'musicfan123@example.com' },
    { id: 'user2', username: 'rocklover', email: 'rocklover@example.com' }
  ],
  songs: [
    { id: 'song1', song_id: 'song1', title: 'Bohemian Rhapsody' }
  ],
  reviews: [
    { id: 'review1', song_id: 'song1', user_id: 'user1', likes: '3', dislikes: '0', review_text: 'An absolute masterpiece! One of the greatest songs ever written.' },
    { id: 'review2', song_id: 'song1', user_id: 'user2', likes: '1', dislikes: '1', review_text: 'Great song, but a bit overplayed. Still a classic though!' }
  ]
};

export default mockDatabase;
