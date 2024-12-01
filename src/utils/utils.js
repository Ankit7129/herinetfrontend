export const renderAttachments = (attachments) =>
    attachments && attachments.length > 0 ? (
      <div className="attachments-container">
        {attachments.map((item, index) => {
          if (item.type === 'image') {
            return (
              <div key={index} className="attachment-item">
                <img src={item.url} alt={`Attachment ${index}`} className="project-attachment" />
              </div>
            );
          } else if (item.type === 'video') {
            return (
              <div key={index} className="attachment-item">
                <video controls className="project-attachment">
                  <source src={item.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          } else {
            return (
              <div key={index} className="attachment-item">
                <p>Unsupported attachment type</p>
              </div>
            );
          }
        })}
      </div>
    ) : null;
  
  export const renderProjectDetails = (projectDetails, postId) => {
    return (
      projectDetails && (
        <div className="project-details">
          <h4>Project Title: {projectDetails.title}</h4>
          <p>{projectDetails.description}</p>
        </div>
      )
    );
  };
  