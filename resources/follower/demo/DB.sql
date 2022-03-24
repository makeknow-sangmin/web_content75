
-- Server version: 5.5.22
-- PHP Version: 5.3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `gantt`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE IF NOT EXISTS `assignments` (
  `Id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `TaskId` int(11) DEFAULT NULL,
  `ResourceId` int(11) DEFAULT NULL,
  `Units` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=23 ;


-- --------------------------------------------------------

--
-- Table structure for table `dependencies`
--

CREATE TABLE IF NOT EXISTS `dependencies` (
  `Id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `From` int(11) DEFAULT NULL,
  `To` int(11) DEFAULT NULL,
  `Type` int(11) DEFAULT NULL,
  `Cls` varchar(255) DEFAULT NULL,
  `Lag` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=39 ;

--
-- Dumping data for table `dependencies`
--

INSERT INTO `dependencies` (`Id`, `From`, `To`, `Type`, `Cls`, `Lag`) VALUES
(1, 8, 9, 2, '', 0),
(2, 13, 14, 2, '', 0),
(3, 14, 15, 2, '', 0),
(4, 16, 17, 0, '', 0),
(5, 15, 16, 0, '', 0),
(6, 17, 18, 2, '', 0),
(7, 7, 3, 2, '', 0),
(8, 7, 18, 2, '', 0),
(9, 10, 11, 2, '', 0),
(10, 11, 12, 0, '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE IF NOT EXISTS `resources` (
  `Id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`Id`, `Name`) VALUES
(1, 'Mats'),
(2, 'Nickolay'),
(3, 'Goran'),
(4, 'Dan'),
(5, 'Jake'),
(6, 'Kim');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE IF NOT EXISTS `tasks` (
  `Id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `parentId` int(11) DEFAULT NULL,
  `PhantomId` varchar(255) DEFAULT NULL,
  `PhantomParentId` varchar(255) DEFAULT NULL,
  `leaf` int(1) DEFAULT '0',
  `Name` varchar(255) DEFAULT NULL,
  `StartDate` varchar(255) DEFAULT NULL,
  `EndDate` varchar(255) DEFAULT NULL,
  `Duration` varchar(255) DEFAULT NULL,
  `DurationUnit` varchar(255) DEFAULT NULL,
  `PercentDone` varchar(255) DEFAULT NULL,
  `Cls` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=79 ;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`Id`, `parentId`, `PhantomId`, `PhantomParentId`, `leaf`, `Name`, `StartDate`, `EndDate`, `Duration`, `DurationUnit`, `PercentDone`, `Cls`) VALUES
(2, NULL, '', '', 0, 'Second project', '2012-09-17T00:00:00', '', '34', 'd', '0', ''),
(7, 1, '', '', 1, 'Marketing', '2012-10-25T00:00:00+02:00', '', '42', 'd', '0', ''),
(1, NULL, '', '', 0, 'Main project', '2012-09-03T00:00:00+02:00', '', '88', 'd', '0', ''),
(5, 1, '', '', 0, 'Alpha', '2012-10-08T00:00:00+02:00', '', '22', 'd', '0', ''),
(4, 1, '', '', 1, 'Initial phase', '2012-09-03T00:00:00+02:00', '', '25', 'd', '70', ''),
(6, 1, '', '', 0, 'Beta', '2012-10-29T00:00:00+01:00', '', '48', 'd', '0', ''),
(8, 2, '', '', 1, 'Research', '2012-09-17T00:00:00', '', '32', 'd', '60', ''),
(9, 2, '', '', 1, 'Test implementation', '2012-11-02T00:00:00', '', '0', 'd', '0', ''),
(3, NULL, '', '', 1, 'Release', '2012-12-26T00:00:00+01:00', '', '0', 'd', '0', ''),
(10, 5, '', '', 1, 'Research', '2012-10-08T00:00:00+02:00', '', '10', 'd', '0', ''),
(11, 5, '', '', 1, 'First implementation', '2012-10-22T00:00:00+02:00', '', '5', 'd', '0', ''),
(12, 5, '', '', 1, 'Tests', '2012-10-25T00:00:00+02:00', '', '9', 'd', '0', ''),
(13, 6, '', '', 1, 'Refactoring after Alpha', '2012-10-29T00:00:00+01:00', '', '10', 'd', '0', ''),
(14, 6, '', '', 1, 'Tests', '2012-11-12T00:00:00+01:00', '', '5', 'd', '0', ''),
(15, 6, '', '', 1, 'Internal beta', '2012-11-19T00:00:00+01:00', '', '15', 'd', '0', ''),
(16, 6, '', '', 1, 'Additional testing', '2012-11-20T00:00:00+01:00', '', '21', 'd', '0', ''),
(17, 6, '', '', 1, 'Public beta', '2012-11-23T00:00:00+01:00', '', '26', 'd', '0', ''),
(18, 6, '', '', 1, 'Release', '2013-01-03T00:00:00+01:00', '', '0', 'd', '0', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
