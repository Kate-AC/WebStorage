import React from 'react';
import { Layout as DefaultLayout } from 'components/layouts/default/Layout';

import { executeTest } from 'utils/ApiClient';

export default function Login (): React.ReactElement {
  const googleLoginUrl =
    'https://accounts.google.com/o/oauth2/auth?' +
    'client_id=66867006406-l402tptfk2jvk5epf7vh028pbr981smv.apps.googleusercontent.com&' +
    'response_type=code&' +
    'scope=openid%20email&' +
    'redirect_uri=' + process.env.NEXT_PUBLIC_BACKEND_URL + '/oauth_google_callback&' +
    'state=';

  return (
    <DefaultLayout>
      <div className="uk-child-width-1-2@s uk-padding" uk-grid>
        <div className="uk-dark uk-background-muted uk-padding">
          <h3>Let's get started !</h3>
          <p>
            Please login with google.
          </p>
          <a href={googleLoginUrl}>
            <img
              src="/google_signin_button.png"
              height="46px"
              width="191px"
              alt="google_signin_button"
            />
          </a>
        </div>
      </div>
    </DefaultLayout>
  );
}
