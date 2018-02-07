import React from 'react';

import Logo from './logo';
import MainTitle from './main_title';
import SearchForm from './search_form';

const Navigation = () => (
    <nav className={'col-12 col-md-3 text-center'}>
        <div className={'row justify-content-center'}>
            <Logo />
            <MainTitle />
            <SearchForm />
        </div>
    </nav>
);

export default Navigation;