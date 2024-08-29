## Datalist style with bootstrap
Show datalist with bootstrap dropdown style.

### Based on
Stack Overflow question:
https://stackoverflow.com/questions/13693482/is-there-a-way-to-apply-a-css-style-on-html5-datalist-options

And answer:
https://codepen.io/iamsidd_j/pen/qBRWNQQ?editors=1010

### Requirements
1. Bootstrap 5.x
2. Jquery 3.x
3. Wrapper element with class '*datalist-wrapper*' for each input and datalist pairs.

### *Usage Example*
   ```
   $(document).ready(function () {
      $('.datalist-input').bootstrapDatalist();
   })
   ```