import 'bulma/css/bulma.min.css';
import './styles/WebsiteTable.css';
import { Columns, Modal, Notification, Heading } from 'react-bulma-components';
import { useState } from 'react';

function Resource({ data }) {
  const day = new Date(data.createdAt)
    .toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })
    .replaceAll('.', '/');
  const list = data.resources.map((r) => {
    const idx = r.name.lastIndexOf('/');
    return {
      name: r.name.substr(idx + 1),
      duration: r.duration.toFixed(3),
      size: (r.size / 1024).toFixed(3),
    };
  });

  const [open, setOpen] = useState(false);

  return (
    <Notification color="primary" p={3} onClick={() => setOpen(true)}>
      <div className="is-flex is-justify-content-center">
        <strong>@ {day}</strong>
      </div>
      <Modal show={open} showClose={false} onClose={() => setOpen(false)}>
        <Modal.Content>
          <Heading textColor="grey">Press 'ESC' to close</Heading>
          {list.map((file, idx) => (
            <Notification color="info" key={idx}>
              <Columns>
                <Columns.Column>
                  <strong>File: </strong> {file.name}
                </Columns.Column>
                <Columns.Column>
                  <strong>Duration: </strong> {file.duration} s
                </Columns.Column>
                <Columns.Column>
                  <strong>Size: </strong> {file.size} KiB
                </Columns.Column>
              </Columns>
            </Notification>
          ))}
        </Modal.Content>
      </Modal>
    </Notification>
  );
}

export default Resource;
