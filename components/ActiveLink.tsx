import { withRouter } from 'next/router'
import Link from 'next/link'
import React, { Children } from 'react'

const ActiveLink = ({ router, children, ...props }: any) => {
  const child = Children.only(children)

  let className = child.props.className || ''
  if (router.pathname === props.href && props.activeClassName) {
    className = `${className} ${props.activeClassName}`.trim()
  }

  delete props.activeClassName

  return <Link {...props}>{React.cloneElement(child, { className })}</Link>
}

export default withRouter(ActiveLink)

/*
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Link from 'next/link'
import React, { Children } from 'react'

const ActiveLink = ({ children, activeClassName, ...props }) => {
  const { asPath } = useRouter()
  const child = Children.only(children)
  const childClassName = child.props.className || ''

  // pages/index.js will be matched via props.href
  // pages/about.js will be matched via props.href
  // pages/[slug].js will be matched via props.as
  const className =
    asPath === props.href || asPath === props.as
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName

  return (
    <Link href={''} {...props}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  )
}

ActiveLink.propTypes = {
  activeClassName: PropTypes.string.isRequired,
}

export default ActiveLink;
*/