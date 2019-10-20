import Link from 'next/link';
// import Router from 'next/router';

const FeedList = ({feeds, onDelete}) => {
  function handleDelete(i) {
   onDelete(i)
  }
  return (
    <div className="feeds">
      {feeds.map((feed, i) => {
        return (
            <Link href="/feed/[slug]" as={`/feed/${feed.slug}`}>
          <div className="feed" key={feed.slug}>
                {/* <img src={`/static/images/${feed.slug}.png`} /> */}
              <div className="feed-img-div" style={{
                backgroundImage: `url("//logo.clearbit.com/${feed.website.split('/')[2]}")`,
              }}>
              </div>
              <b>
                <div>{feed.title}</div>
              </b>
                <button onClick={() => handleDelete(i)}>DEL</button>
          </div>
            </Link>
        );
      })}

      <style jsx>{`
        .feeds {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-bottom: 50px;
          flex-direction: column;
          margin: 0 auto;
          text-align: center;
        }
        .feed {
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: 3px solid;
          border-radius: 4px;
          align-items: center;
          border-color: transparent;
          display: flex;
          justify-content: space-between;
        }
        .feed-img-div {
          width: 120px; 
          height: 120px; 
          border-radius: 5px;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .feed:hover {
          border-color: inherit;
        }
        button:hover {
          background: orangered;
          color: white;
        }
        .feed a {
          display: block;
          line-height: 1.5;
        }
        @media (max-width: 600px) {
          .feed {
            flex-direction: column;
          }
          .feed-img-div {
           margin: 10px; 
          }
          .feed b {
            margin: 10px;
          }

        }
      `}</style>
    </div>
  );
};

export default FeedList;
