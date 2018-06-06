<?php

namespace OCA\MemoPad\Controller;

use Closure;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;

use OCA\MemoPad\Service\NotFoundException;


trait Errors {

    /**
     * Execute the function closure passed in as parameter and try to return a DataResponse.
     * If unsuccessful (cannot find the resource), return a 404 response.
     */
    protected function handleNotFound (Closure $callback) {
        try {
            return new DataResponse($callback());
        } catch(NotFoundException $e) {
            $message = ['message' => "Damn it not found! " . $e->getMessage()];
            return new DataResponse($message, Http::STATUS_NOT_FOUND);
        }
    }

}
