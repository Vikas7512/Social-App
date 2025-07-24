import "./postSkeleton.scss";

export const PostSkeleton = () => {
  return (
    <div className="post skeleton">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <div className="skeleton-avatar" />
            <div className="details">
              <div className="skeleton-line short" />
              <div className="skeleton-line very-short" />
            </div>
          </div>
          <div className="skeleton-icon" />
        </div>
        <div className="content">
          <div className="skeleton-line" />
          <div className="skeleton-image" />
        </div>
        <div className="info">
          <div className="skeleton-line short" />
          <div className="skeleton-line short" />
          <div className="skeleton-line short" />
        </div>
      </div>
    </div>
  );
};
