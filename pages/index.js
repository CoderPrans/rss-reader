import feeds from '../data/feeds';
import Page from '../components/page';
import FeedList from '../components/feed-list';
import {useState, useEffect, useContext} from 'react';
import ThemeContext from '../components/ThemeContext';


export default function Index(props) {
  const [localFeeds, setLocalFeeds] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [newFeedTitle, setNewFeedTitle] = useState('');
  const [newFeedWebsite, setNewFeedWebsite] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');

const themeIsDark = useContext(ThemeContext) === 'dark';

  useEffect(() => {
    fetch('/api/getUser')
      .then(res => res.json())
      .then(data => {
        console.log('recieved from api/getUser', data); 
        if(data.user) {
          setLocalFeeds(data.user.feeds);
        }
    });
  },[])

  useEffect(() => {
    !localFeeds.length ? loadStorage() : updateStorage();
  }, [localFeeds]);
  
  function loadStorage() {
    let initialFeeds = localStorage.getItem('_feeds')
      ? JSON.parse(localStorage.getItem('_feeds'))
      : feeds;
    setLocalFeeds(initialFeeds);
  }

  function updateStorage() {
    localStorage.setItem('_feeds', JSON.stringify(localFeeds));
  }

  function updateDB(feedsArray) {
    setLocalFeeds(feedsArray);
    fetch('/api/update', {
      method: 'POST',
      body: JSON.stringify(feedsArray)
    }).then(res => res.json())
      .then(data => {
        if(data.mssg === 'Saved') {
          alert('changes saved');
        }
      }).catch(err => console.log(err))
   
    setNewFeedTitle('');
    setNewFeedWebsite('');
    setNewFeedUrl('');
  }

  function handleDelete(i){
    let newLocalFeeds = [...localFeeds.slice(0, i), ...localFeeds.slice(i+1)]
    setLocalFeeds(newLocalFeeds);
    updateDB(newLocalFeeds);
  }
  
  return (
    <Page>
      <button
        className="toggle-visibility"
        title={!formVisible ? `Add Feed` : `---`}
        onClick={() => setFormVisible(!formVisible)}>
        <i className={`fa fa-${formVisible ? `minus` : `plus`}-circle`}></i>
      </button>
      <div className={`add-feed ${themeIsDark ? 'dark' : ''}`}>
        <div className={`feed-form ${!formVisible ? `unvisible` : ``}`}>
          <input
            placeholder="Enter Title .."
            onChange={e => setNewFeedTitle(e.target.value)}
            value={newFeedTitle}
          />
          <input
            placeholder="Enter Website .."
            onChange={e => setNewFeedWebsite(e.target.value)}
            value={newFeedWebsite}
          />
          <input
            placeholder="Enter Url .."
            onChange={e => setNewFeedUrl(e.target.value)}
            value={newFeedUrl}
          />
          <button
            onClick={() => 
              updateDB([...localFeeds, {
                  title: newFeedTitle,
                  slug: newFeedTitle.replace(/ /g, '-').toLowerCase(),
                  website: newFeedWebsite,
                  url: newFeedUrl,
              }])
            }>
            Submit
          </button>
        </div>
      </div>
      {localFeeds.length ? (
        <>
        <FeedList feeds={localFeeds} onDelete={handleDelete} />
        </>
      ) : (
        <p style={{textAlign: 'center'}}>...</p>
      )}
      <style jsx>{`
        .unvisible {
          display: none;
        }
        .toggle-visibility {
          width: 40px;
        }
        .toggle-visibility:hover {
          border-color: #aaa;
        }
        .add-feed {
          position: sticky;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }
        .add-feed input {
          padding: 2px 5px;
          height: 30px;
          font-size: 14px;
          border-radius: 3px;
          border: none;
          margin: 15px;
          margin-left: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }
        .dark input {
          background-color: #333;
          color: #eee;
        }
        .add-feed button {
          background-color: forestgreen;
          color: white;
          height: 30px;
          cursor: pointer;
          font-size: 14px;
          border: none;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.5);
          margin: 5px;
          margin-left: 13px;
        }
      `}</style>
    </Page>
  );
}
