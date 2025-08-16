const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/runworkflow', async (req, res) => {
  try {
    const loginPayload = new URLSearchParams({
      userName: '501348',
      clientResponse: 'a21678e8223dfbb07e0d61c51cdce217ca552f542c193dc5f61252247f4abc62dc0f294f316ba4da6d59d8b088d118ef95a74be26eff11c1e2848c017d9299401762c21ed1d3c92ed0f006b16e89597c01ebaf79ed4513c4c8b6764c9ae583fa83758fe4ed7b1990308531c4f5baf2bd1d964b6d0e1e60644bd4907c79539d03c68d23cb01e4de0ed4d57a6b94e2ae4bc4c6ab330cb3aa84c6e99fd4c3aa508bcd39da5a7e04f134d46605736b47aa625421608050b2effbe045a053abc0043b088e5403_158'
    }).toString();

    const loginRes = await axios.post(
      'https://bpms.marinagroup.org/Web/Ajax.+',
      loginPayload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Origin': 'https://bpms.marinagroup.org',
          'Referer': 'https://bpms.marinagroup.org/web/Form.+?rg=POR.ACC.LoginNormal&OrganizationCode=ICA',
          'X-BestPracticeAjax-Class': '8f510237511e48cc33c20fa86fa4982a',
          'X-BestPracticeAjax-Method': 'c19235e28106c5717895667027885d22',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );

    const cookies = loginRes.headers['set-cookie'];
    if (!cookies) {
      return res.status(401).json({ error: 'Login failed, no cookies returned.' });
    }

    const workflowPayload = new URLSearchParams({
      registerKey: 'ZJM.IRM.IdeaRegistrationProcess',
      content: '<Content><Id>123</Id><IsInTestMode>true</IsInTestMode></Content>'
    }).toString();

    const workflowRes = await axios.post(
      'https://bpms.marinagroup.org/Web/Ajax.+',
      workflowPayload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': cookies.join('; '),
          'X-BestPracticeAjax-Class': '1ea6826a12d3c99da04cc13212e2d06f',
          'X-BestPracticeAjax-Method': '0a8beaad13595ec400446b677ce5983b',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );

    res.json({ success: true, data: workflowRes.data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
