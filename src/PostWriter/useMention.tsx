// import { User } from '#/api/users/types';
// import { Typography } from '@mui/material';
// import { MentionComponent } from '@syncfusion/ej2-react-dropdowns';
// import React from 'react';
// import { useRef } from 'react';

// export const useMention = () => {
//   const mentionObj = useRef<MentionComponent | null>(null);
//   let fieldsData: { [key: string]: string } = { text: 'Name' };

//   function itemTemplate(data: User) {
//     return (
//       <table width='100%'>
//         <thead>
//           <tr>
//             <td>
//               <div id='mention-TemplateList'>
//                 {/* <img className='mentionEmpImage' src={data.username} /> */}
//                 <span
//                   className={
//                     'e-badge e-badge-success e-badge-overlap e-badge-dot e-badge-bottom'
//                   }
//                 ></span>
//               </div>
//             </td>

//             <td className='mentionNameList'>
//               <span className='person'>{data.username}</span>
//             </td>
//           </tr>
//         </thead>
//       </table>
//     );
//   }
//   function displayTemplate(data: User) {
//     return (
//       <React.Fragment>
//         <Typography
//           component='span'
//           data-type='mention'
//           data-username={data.username}
//           data-id={data.id}
//           className='mention'
//           sx={{ color: 'primary.main' }}
//         >
//           @{data.username}
//         </Typography>
//       </React.Fragment>
//     );
//   }

//   function actionBegineHandler(args: any): void {
//     if (
//       args.requestType === 'EnterAction' &&
//       mentionObj.current?.element.classList.contains('e-popup-open')
//     ) {
//       args.cancel = true;
//     }
//   }
//   return {
//     actionBegineHandler,
//     displayTemplate,
//     itemTemplate,
//     mentionObj,
//     fieldsData,
//   };
// };
