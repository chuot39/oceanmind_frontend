
// Navigate to group detail page
export const handleNavigateToDetail = ({ object, type = 'group', navigate }) => {
    console.log('object: ', object);
    navigate(`/social/${type}/${object.documentId}`, { state: { objectId: object.documentId } });
};

export const handleNavigateToDetailProfile = ({ username, navigate }) => {
    navigate(`/profile/information/${username}`, { state: { username: username } });
};
