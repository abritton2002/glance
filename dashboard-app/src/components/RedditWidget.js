import React, { useState, useEffect } from 'react';
import redditService from '../services/redditService';
import { FaReddit } from 'react-icons/fa';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

const RedditWidget = ({ 
  title,
  subreddit, 
  showThumbnails = true, 
  collapseAfter = 6,
  style = 'vertical-list'
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!subreddit) {
        setError('No subreddit specified');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await redditService.getSubredditPosts(subreddit);
        setPosts(data);
      } catch (err) {
        setError(err.message || 'Failed to load posts');
        console.error('Error loading Reddit posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [subreddit]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-red-600 font-medium mb-2">{error}</div>
        <div className="text-sm text-gray-500">r/{subreddit}</div>
      </div>
    );
  }

  const displayedPosts = isCollapsed ? posts.slice(0, collapseAfter) : posts;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaReddit className="w-6 h-6 text-[#FF4500] mr-2" />
          <h3 className="text-lg font-medium text-gray-900">{title || `r/${subreddit}`}</h3>
        </div>
        {posts.length > collapseAfter && (
          <button
            onClick={toggleCollapse}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            {isCollapsed ? (
              <>
                Show More <IoMdArrowDropdown className="ml-1" />
              </>
            ) : (
              <>
                Show Less <IoMdArrowDropup className="ml-1" />
              </>
            )}
          </button>
        )}
      </div>
      
      <div className={`space-y-4 ${style === 'grid-cards' ? 'grid grid-cols-2 gap-4' : ''}`}>
        {displayedPosts.map(post => (
          <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex">
              {showThumbnails && post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' && (
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
                  href={`https://reddit.com${post.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 block"
                >
                  {post.title}
                </a>
                <div className="mt-1 flex items-center text-xs text-gray-500 flex-wrap">
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
    </div>
  );
};

export default RedditWidget; 