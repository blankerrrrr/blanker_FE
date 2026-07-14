import styled from 'styled-components'
import PostCard from './PostCard.jsx'

const Grid = styled.section`
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`

function PostFeed({ posts }) {
  return (
    <Grid aria-label="게시글 피드">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Grid>
  )
}

export default PostFeed
