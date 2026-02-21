const Disclaimer = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-light-bg dark:bg-dark-bg">
      <div className="container max-w-4xl">
        <div className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 prose dark:prose-invert max-w-none">
          <h1>Disclaimer & DMCA</h1>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 my-6">
            <p className="font-bold text-yellow-700 dark:text-yellow-500 m-0">Important Notice</p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 m-0">
              GAMES MART does not host any copyrighted paid games. All trademarks, logos, and images belong to their respective owners.
            </p>
          </div>

          <h3>Content Disclaimer</h3>
          <p>
            The content provided on Games Mart is for educational and informational purposes only. We do not claim ownership of any of the games or apps listed on this site.
            All download links are from third-party sources or official developer websites.
          </p>

          <h3>DMCA Copyright Infringement</h3>
          <p>
            We respect the intellectual property rights of others. If you believe that your work has been copied in a way that constitutes copyright infringement, please contact us immediately.
            Upon receipt of a valid DMCA notice, we will remove the infringing content.
          </p>

          <h3>No Warranty</h3>
          <p>
            The files and software are provided "as is" without warranty of any kind, either express or implied. Use at your own risk.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
