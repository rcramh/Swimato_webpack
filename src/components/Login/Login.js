import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './login.css';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),

  email: Yup.string()
  .email('Invalid email')
  .required('Required'),

  password : Yup.string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters long')
  .matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

const Login = () => (
  <div>
    <Formik
      initialValues={{
        firstName: '',
        email: '',
        password: '',
      }}
      validationSchema={SignupSchema}
      onSubmit={values => {
        // same shape as initial values
        console.log(values);
      }}
    >
    
      
      {({ errors, touched }) => (
        <Form>
          <div className='signup_parent'>
          
            <div className='signup_container'>
            <h1 className='sign_up'>Sign up </h1>

              <Field name="firstName" className='first_name' placeholder="Name" />
              {errors.firstName && touched.firstName ? (
                <div>{errors.firstName}</div>
              ) : null}

              <Field name="email" className='email' type="email" placeholder="Email" />
              {errors.email && touched.email ? <div>{errors.email}</div> : null}

              <Field name="password" className="Password" placeholder="Password" />
              {errors.password && touched.password ? (
                <div>{errors.password}</div>
              ) : null}
            
              <button className='submit_button' type="submit">Submit</button>

            </div>
          </div>
          
        </Form>
      )}
    </Formik>
  </div>
);

export default Login;