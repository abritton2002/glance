import React, { useState, useEffect } from 'react';
import redditService from '../services/redditService';

const RedditWidget = ({ subreddit }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await redditService.getSubredditPosts(subreddit);
        setPosts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [subreddit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <img 
          src={posts[0]?.subreddit_icon} 
          alt="Subreddit Icon" 
          className="w-8 h-8 rounded-full mr-2"
        />
        <h3 className="text-sm font-medium text-gray-900">r/{subreddit}</h3>
      </div>
      {posts.map(post => (
        <div key={post.id} className="border-b border-gray-200 pb-4">
          <div className="flex">
            {post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' && (
              <div className="mr-3 flex-shrink-0">
                <img
                  src={post.thumbnail}
                  alt="Post thumbnail"
                  className="w-16 h-16 object-cover rounded"
                  style={{
                    width: post.thumbnail_width || 64,
                    height: post.thumbnail_height || 64
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 block truncate"
              >
                {post.title}
              </a>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <span>by {post.author}</span>
                <span className="mx-1">•</span>
                <span>{post.score} points</span>
                <span className="mx-1">•</span>
                <span>{post.num_comments} comments</span>
                <span className="mx-1">•</span>
                <span>{post.created}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RedditWidget; 