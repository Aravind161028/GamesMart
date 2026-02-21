const Privacy = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-light-bg dark:bg-dark-bg">
      <div className="container max-w-4xl">
        <div className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 prose dark:prose-invert max-w-none">
          <h1>Privacy Policy</h1>
          <p>Last updated: May 20, 2025</p>
          
          <h3>1. Introduction</h3>
          <p>Welcome to Games Mart. We respect your privacy and are committed to protecting your personal data.</p>

          <h3>2. Data We Collect</h3>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
          <ul>
            <li>Identity Data includes username or similar identifier.</li>
            <li>Contact Data includes email address.</li>
            <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
            <li>Usage Data includes information about how you use our website and services.</li>
          </ul>

          <h3>3. How We Use Your Data</h3>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul>
            <li>To register you as a new customer.</li>
            <li>To manage our relationship with you.</li>
            <li>To improve our website, products/services, marketing or customer relationships.</li>
          </ul>

          <h3>4. Data Security</h3>
          <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
