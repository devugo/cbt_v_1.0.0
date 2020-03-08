<?php

if(!function_exists('host'))
{
    function host(){
        return 'https://127.0.0.1';
    }
}

if(!function_exists('port'))
{
    function port(){
        return '8000';
    }
}

if(!function_exists('base_url'))
{
    function base_url(){
        return host() . ':' . port();
    }
}

if(!function_exists('default_password'))
{
    function default_password(){
        return 'password';
    }
}