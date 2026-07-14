import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

const sizeStyles = {
  hero: css`
    grid-column: 1 / -1;
    aspect-ratio: 1.42;
  `,
  tall: css`
    grid-row: span 2;
    min-height: 326px;
  `,
  small: css`
    min-height: 158px;
  `,
}

const Article = styled.article`
  min-width: 0;
  overflow: hidden;
  background: #222;
  ${({ $size }) => sizeStyles[$size] ?? sizeStyles.small}
`

const CardLink = styled(Link)`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  color: #fff;
  text-decoration: none;
`

const Image = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Shade = styled.div`
  position: absolute;
  inset: 40% 0 0;
  background: linear-gradient(transparent, rgb(0 0 0 / 78%));
`

const Copy = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  padding: 12px;
`

const Title = styled.h2`
  margin: 0 0 3px;
  font-size: ${({ $size }) => ($size === 'hero' ? '32px' : '20px')};
  line-height: 1;
  text-transform: uppercase;
`

const Description = styled.p`
  margin: 0;
  font-size: 11px;
  line-height: 1.3;
`

function PostCard({ post }) {
  return (
    <Article $size={post.size}>
      <CardLink aria-label={`${post.title} 게시글 보기`} to={`/posts/${post.id}`}>
        {post.image && (
          <Image
            alt=""
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
            src={post.image}
          />
        )}
        <Shade />
        <Copy>
          <Title $size={post.size}>{post.title}</Title>
          <Description>{post.description}</Description>
        </Copy>
      </CardLink>
    </Article>
  )
}

export default PostCard
