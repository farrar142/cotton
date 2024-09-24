import useValue from '#/hooks/useValue';
import { ArrowBack, Close } from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Box,
  Button,
  Dialog,
  Divider,
  Fade,
  IconButton,
  Paper,
  Stack,
  Tab,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import DraftEditor from '#/PostWriter/DraftEditor';
import API from '#/api';
import * as React from 'react';
import CommonLayout from '#/components/layouts/CommonLayout';
// import PostWriter from '#/PostWriter';
// const DraftEditor = dynamic(() => import('#/PostWriter/DraftEditor'), {
//   ssr: true,
// });

const Home = () => {
  const theme = useTheme();
  const tabValue = useValue('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    tabValue.set(newValue);
  };

  return (
    <CommonLayout>
      <Box>
        <TabContext value={tabValue.get}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              position: 'sticky',
              top: 0,
              backdropFilter: 'blur(5px)',
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label='lab API tabs example'
              sx={{ button: { width: '50%' } }}
            >
              <Tab label='추천' value='1' />
              <Tab label='팔로우 중' value='2' />
            </TabList>
          </Box>
          <TabPanel value='1'>
            {/* <PostWriter /> */}
            {/* <DraftEditor /> */}
            <div
              dangerouslySetInnerHTML={{
                __html: `<table align="center" width="796" cellspacing="0" cellpadding="0" bgcolor="#E2E2E2">
            <tbody>
                <tr>
                    <td style="text-align:center;padding:55px 0px 35px"></td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>
                        <table id="m_3314480020993934552main-panel" align="center" cellpadding="0" cellspacing="0" style="border-spacing:0;border-collapse:collapse;background-color:white;vertical-align:top;width:540px;margin-left:auto;margin-right:auto;border-bottom:1px solid #f2f2f2">
                            <tbody>
                                                                    <tr>
                                        <td align="center" style="font-size:22px;color:#252525;line-height:25px;font-weight:light;padding:50px 0px 30px 0px;width:540px">
                                            <b>Welcome to Syncfusion</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="font-size:18px;color:#666666;line-height:25px;font-weight:regular;padding:0px 30px 0px 30px;width:540px">
                                            We have created an account in your name.
                                        </td>
                                    </tr>
                                                                            <tr>
                                            <td align="center" style="font-size:18px;color:#666666;line-height:25px;font-weight:regular;padding:30px 30px 0px 30px;width:540px">
                                                You chose not to receive promotional emails from Syncfusion including updates about our products free resources, including our e-book series, and discount offers.<br><br> If you want to change your email preferences you can access them any time using this <a href="https://click.pstmrk.it/3s/www.syncfusion.com%2Faccount%2Femail-preference%3Ftoken%3DFXZnbgRU64PPYf%252ftTBjVWeDzF36j7zYPvv1yejNymmk%253d%26provenance%3DAccountActivationEmail_SubscriptionForms_Version31/c4Jk/1jO4AQ/AQ/31aa84bc-7ee2-4a88-b1b9-b7d73a506b63/1/FLkAsJaH5h" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.pstmrk.it/3s/www.syncfusion.com%252Faccount%252Femail-preference%253Ftoken%253DFXZnbgRU64PPYf%25252ftTBjVWeDzF36j7zYPvv1yejNymmk%25253d%2526provenance%253DAccountActivationEmail_SubscriptionForms_Version31/c4Jk/1jO4AQ/AQ/31aa84bc-7ee2-4a88-b1b9-b7d73a506b63/1/FLkAsJaH5h&amp;source=gmail&amp;ust=1727277110408000&amp;usg=AOvVaw3JmE-6tQy9I0f9oYipnlgQ">link</a>.
                                            </td>
                                        </tr>
                                                                    
                            </tbody>
                        </table>
                        <table id="m_3314480020993934552main-panel" align="center" cellpadding="0" cellspacing="0" style="border-spacing:0;border-collapse:collapse;vertical-align:top;width:540px;background-color:white;margin-left:auto;margin-right:auto">
                            <tbody>
                                                              <tr>
                                    <td align="center" style="font-size:18px;color:#666666;line-height:25px;font-weight:regular;padding:40px 0px 30px 0px;width:540px">
                                        Click the create password button to set the password
                                        <br>
                                        for your new syncfusion account.
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding:0px 0px 30px 0px;width:540px">
                                        <a href="https://click.pstmrk.it/3s/www.syncfusion.com%2Faccount%2Fcreatepassword%3Fkey%3DFXZnbgRU64PPYf%252ftTBjVWeDzF36j7zYPvv1yejNymmk%253d%26hashtoken%3Db3e3e393c77e35a4a3f3cbd1e429b5dc/c4Jk/1jO4AQ/AQ/31aa84bc-7ee2-4a88-b1b9-b7d73a506b63/2/1fLrCl9DRi" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.pstmrk.it/3s/www.syncfusion.com%252Faccount%252Fcreatepassword%253Fkey%253DFXZnbgRU64PPYf%25252ftTBjVWeDzF36j7zYPvv1yejNymmk%25253d%2526hashtoken%253Db3e3e393c77e35a4a3f3cbd1e429b5dc/c4Jk/1jO4AQ/AQ/31aa84bc-7ee2-4a88-b1b9-b7d73a506b63/2/1fLrCl9DRi&amp;source=gmail&amp;ust=1727277110408000&amp;usg=AOvVaw3VW5lGCHgwBOhBUVV_hK6j">
                                            <img border="0" alt="Create Password" src="https://ci3.googleusercontent.com/meips/ADKq_NZ9YBD-u-HMtYSs7pa43EdlM3VVjJhtctufvewekafhVozvGOi8xh9u7Z1-tN64oqLFFVw2uKMDXr2zN6OHyatfeMbjintIWXMuIEgvIzmqANhjVEPjcm8TipJ1Q3b6ittdInQ_AvxSrRQ=s0-d-e1-ft#https://cdn.syncfusion.com/content/images/emailtemplates/account_password_button.png" class="m_3314480020993934552image-style CToWUd" height="36" width="200" data-bit="iit">
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-size:16px;color:#666666;line-height:25px;padding:0px 0px 7px 0px;width:540px;font-weight:regular">
                                        or copy and paste the <a href="https://click.pstmrk.it/3s/www.syncfusion.com%2Faccount%2Fcreatepassword%3Fkey%3DFXZnbgRU64PPYf%252ftTBjVWeDzF36j7zYPvv1yejNymmk%253d%26hashtoken%3Db3e3e393c77e35a4a3f3cbd1e429b5dc/c4Jk/1jO4AQ/AQ/31aa84bc-7ee2-4a88-b1b9-b7d73a506b63/2/1fLrCl9DRi" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.pstmrk.it/3s/www.syncfusion.com%252Faccount%252Fcreatepassword%253Fkey%253DFXZnbgRU64PPYf%25252ftTBjVWeDzF36j7zYPvv1yejNymmk%25253d%2526hashtoken%253Db3e3e393c77e35a4a3f3cbd1e429b5dc/c4Jk/1jO4AQ/AQ/31aa84bc-7ee2-4a88-b1b9-b7d73a506b63/2/1fLrCl9DRi&amp;source=gmail&amp;ust=1727277110408000&amp;usg=AOvVaw3VW5lGCHgwBOhBUVV_hK6j">link</a> into your browser.
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-size:13px;font-family:'Open Sans';padding:0px 0px 50px 0px;width:540px;line-height:25px">
                                        <b>Note:</b>
                                        The link will be valid for 3 hours.
                                    </td>
                                </tr>
                                                            </tbody>
                        </table>
                        <table id="m_3314480020993934552main-panel" align="center" cellpadding="0" cellspacing="0" style="border-spacing:0;border-collapse:collapse;vertical-align:top;width:540px;background-color:#eff2f4;margin-left:auto;margin-right:auto;border-bottom:1px solid #e2e2e2">
                            <tbody>
                                <tr>
                                    <td align="center" style="font-size:24px;color:#252525;line-height:25px;font-weight:500;padding:35px 0px 20px 0px">
                                        <b>Need any help?</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-size:16px;color:#666666;line-height:25px;padding:0px 0px 20px 0px">
                                        If you have any queries, please contact
                                        <br>
                                        us via email at
                                        <a href="mailto:support@syncfusion.com" target="_blank">support</a><br>
                                        or<br>
                                        Call us at
                                        <b style="color:#252525;font-weight:800">1-888-9DOTNET/1-919-481-1974</b>.
                                    </td>
                                </tr>
                                <tr style="text-align:center;padding:0px;vertical-align:top">
                                    <td style="font-size:14px;color:#666666;font-style:normal;font-family:calibri;font-weight:normal;line-height:25px;text-decoration:none;text-align:center;padding:0px 50px 25px;word-break:break-word;margin:0;display:inline-block;border-collapse:collapse!important">
                                        
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>`,
              }}
            ></div>
          </TabPanel>
          <TabPanel value='2'>Item Two</TabPanel>
        </TabContext>
      </Box>
    </CommonLayout>
  );
};
export default Home;

const lorem = `Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            architecto ad at eius iste quos ipsam cum consectetur? Iure in illo
            dolore eum maiores, repellendus vero ratione sequi asperiores ullam!
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
            assumenda quia consequuntur. Quidem nobis facilis nisi, iusto nemo
            nihil earum optio quas in rerum nesciunt excepturi tenetur,
            doloremque, explicabo voluptas?`;
