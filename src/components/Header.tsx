export default function Header() {
    return (
      <header className="flex justify-between items-center px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-purple-600">FORMVIVE</h1>
        <nav className="space-x-4">
          <a href="#demo" className="text-sm text-gray-600 hover:text-purple-600">View demo</a>
          <a href="#contact" className="text-sm text-gray-600 hover:text-purple-600">Contact Us</a>
        </nav>
      </header>
    )
  }