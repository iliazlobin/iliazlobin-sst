interface DocsLayoutProps {
  children: React.ReactNode
}

export default function BlogLayout({ children }: DocsLayoutProps) {
  return <div className="border-b">{children}</div>
}
