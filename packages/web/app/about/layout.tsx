interface DocsLayoutProps {
  children: React.ReactNode
}

export default function PresentationsLayout({ children }: DocsLayoutProps) {
  return <div className="border-b">{children}</div>
}
