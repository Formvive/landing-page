
export default function WaitlistForm() {
    return (
      <section id="contact" className="bg-purple-50 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Waiting List</h2>
          <p className="text-gray-600 mb-6">Be the first to try Formvive and get early access to predictive feedback tools.</p>
          <form className="grid gap-4 text-left">
            <input type="text" placeholder="Name" className="p-3 rounded border border-gray-300 w-full" />
            <input type="email" placeholder="Email" className="p-3 rounded border border-gray-300 w-full" />
            <input type="tel" placeholder="Phone Number" className="p-3 rounded border border-gray-300 w-full" />
            <input type="text" placeholder="Additional Links (Github, LinkedIn, etc)" className="p-3 rounded border border-gray-300 w-full" />
            <button type="submit" className="mt-2 bg-purple-600 text-white py-3 rounded hover:bg-purple-700 w-full">Join the Waiting List</button>
          </form>
        </div>
      </section>
    )
  }