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

if(!function_exists('can_resource'))
{
    //  Check if a use rcxan take action on any resource
    function can_resource($user, $action, $resource){
        switch($resource){
            case 'users':
                return $user->getAccountType()->getUsersPrivileges()[$action];
            break;
            case 'subjects':
                return $user->getAccountType()->getSubjectsPrivileges()[$action];  
            break;
            case 'questions':
                return $user->getAccountType()->getQuestionsPrivileges()[$action];
            break;
            case 'notifications':
                return $user->getAccountType()->getNotificationsPrivileges()[$action];
            break;
            case 'levels':
                return $user->getAccountType()->getLevelsPrivileges()[$action];
            break;
            case 'account_types':
                return $user->getAccountType()->getAccountTypesPrivileges()[$action];
            break;
            case 'user_groups':
                return $user->getAccountType()->getUserGroupsPrivileges()[$action];
            break;
            case 'exams':
                return $user->getAccountType()->getExamsPrivileges()[$action];
            break;
            default:
                return false;
        }
    }
}