import 'bulma/css/bulma.min.css';
import { Columns } from 'react-bulma-components';
import './styles/WebsiteTable.css';
import Website from './Website';
import { useEffect, useState } from 'react';
import { deleteWebsite, getWebsites } from '../api';
import bulmaCollapsible from '@creativebulma/bulma-collapsible';

function WebsiteTable() {
  const [websites, setWebsites] = useState([]);

  useEffect(() => {
    getWebsites()
      .then((list) => {
        setWebsites(list);
        bulmaCollapsible.attach('.is-collapsible');
      })
      .catch((err) => console.error(err));
  }, []);

  function handleDelete(id) {
    deleteWebsite(id)
      .then(() => getWebsites())
      .then((list) => {
        setWebsites(list);
      });
  }

  return (
    <div>
      <Columns className="table-header" mt="3">
        <Columns.Column>
          <p>Website</p>
        </Columns.Column>
        <Columns.Column>
          <abbr title="Website Identifier">ID</abbr>
        </Columns.Column>
        <Columns.Column></Columns.Column>
      </Columns>

      {websites.map((site, idx) => (
        <Website data={site} key={idx} onDelete={handleDelete}></Website>
      ))}
    </div>
  );
}

export default WebsiteTable;
